import React, { useEffect, useRef, useState } from 'react';
import playerImg from '../../assets/player.png';
import hurdle1Img from '../../assets/hurdle1.png';
import hurdle2Img from '../../assets/hurdle2.png';
import coinImg from '../../assets/coin.png';
import quizBoxImg from '../../assets/quizpop.png';
import backgroundImg from '../../assets/game-background1.png';
import flagImg from '../../assets/flag.png';         // 깃발 이미지
import playerEndImg from '../../assets/finish_player.png'; // 종료용 캐릭터 이미지


export default function Game() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const updateRef = useRef(null);

  const frameRef = useRef(0);
  const gameSpeedRef = useRef(7);
  const backgroundXRef = useRef(0);
  const entitiesRef = useRef([]);
  const playerRef = useRef({});
  const pausedSnapshotRef = useRef(null);

  const playerImageRef = useRef(null);
  const coinImageRef = useRef(null);
  const quizBoxImageRef = useRef(null);
  const hurdleImagesRef = useRef([]);

  const quizCountRef = useRef(0);

  const [gameOver, setGameOver] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const groundHeightRatioRef = useRef(0.15);

  const [penaltyVisible, setPenaltyVisible] = useState(false);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [wrongVisible, setWrongVisible] = useState(false);

  const flagImageRef = useRef(null);

  const [flagScheduled, setFlagScheduled] = useState(false);
  const [flagShown, setFlagShown] = useState(false);
  const [ending, setEnding] = useState(false);
  const endingRef = useRef(false);

  const flagPushedRef = useRef(false);


  function snapshotState() {
    const quizFilteredEntities = entitiesRef.current.filter(e => e.type !== 'quiz');
    pausedSnapshotRef.current = {
      frame: frameRef.current,
      gameSpeed: gameSpeedRef.current,
      backgroundX: backgroundXRef.current,
      entities: JSON.parse(JSON.stringify(quizFilteredEntities)),
      player: JSON.parse(JSON.stringify(playerRef.current)),
    };
  }

  function restoreSnapshot() {
    const snap = pausedSnapshotRef.current;
    if (!snap) return;

    frameRef.current = snap.frame;
    gameSpeedRef.current = snap.gameSpeed;
    backgroundXRef.current = snap.backgroundX;
    playerRef.current = { ...snap.player };

    const restoredEntities = snap.entities.map(e => {
      const newEntity = { ...e };
      // 이미지 객체 복원
      if (e.type === 'coin') newEntity.img = coinImageRef.current;
      else if (e.type === 'quiz') newEntity.img = quizBoxImageRef.current;
      else if (e.type === 'hurdle') {
        if (e.width > e.height) newEntity.img = hurdleImagesRef.current[0];
        else newEntity.img = hurdleImagesRef.current[1];
      }
      return newEntity;
    });

    entitiesRef.current.splice(0, entitiesRef.current.length, ...restoredEntities);
    pausedSnapshotRef.current = null;
  }

  function handleQuizAnswer(answer) {
    if (!quiz) return;
  
    if (quizCountRef.current === 3 && !flagScheduled) {
        setFlagScheduled(true);
        setTimeout(() => {
          setFlagShown(true);
          const canvas = canvasRef.current; 

          const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
          const flagHeight = canvas.height * 0.2;
          const flagWidth = flagHeight * 0.5;
          entitiesRef.current.push({
            type: 'flag',
            x: canvas.width,
            y: yBase - flagHeight,
            width: flagWidth,
            height: flagHeight,
            img: flagImageRef.current
          });
          flagPushedRef.current = true;
        }, 5000);
      }

    if (answer === quiz.answer) {
      setQuiz(null);
      
      restoreSnapshot();
      
      scoreRef.current += 50
      setIsPaused(false);
      setCorrectVisible(true);
      setTimeout(() => setCorrectVisible(false), 1000);

      requestAnimationFrame(updateRef.current);
    } else {
      setQuiz(null);
      
      restoreSnapshot();

      scoreRef.current = 0
      setIsPaused(false);
      setWrongVisible(true);
      setTimeout(() => setWrongVisible(false), 1000);
      
      requestAnimationFrame(updateRef.current);
    }
  }

  function showPenaltyEffect() {
    setPenaltyVisible(true);
    setTimeout(() => setPenaltyVisible(false), 800);
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    scoreRef.current = score;

    const bgImg = new Image(); bgImg.src = backgroundImg;
    const playerImage = new Image(); playerImage.src = playerImg;
    playerImageRef.current = playerImage;

    const hurdleImages = [new Image(), new Image()]; 
    hurdleImages[0].src = hurdle1Img;
    hurdleImages[1].src = hurdle2Img;
    hurdleImagesRef.current = hurdleImages;
    const coinImage = new Image(); coinImage.src = coinImg; coinImageRef.current = coinImage;
    const quizBoxImage = new Image(); quizBoxImage.src = quizBoxImg; quizBoxImageRef.current = quizBoxImage;

    const flagImage = new Image(); flagImage.src = flagImg;
    const playerEndImage = new Image(); playerEndImage.src = playerEndImg;
    flagImageRef.current = flagImage;

    const groundHeightRatio = 0.15;
    playerRef.current = {
      x: 100, y: 0, width: 0, height: 0,
      vy: 0, gravity: 2, jumpForce: -28, isJumping: false,
    };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const player = playerRef.current;
      player.width = canvas.width * 0.1;
      player.height = canvas.height * 0.28;
      player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
    }

    function detectCollision(player, obs) {
      // 충돌 감지를 위한 여백 적용 (히트박스 최적화)
      const px = player.x + player.width * 0.25;
      const pw = player.width * 0.5;
      const py = player.y + player.height * 0.25;
      const ph = player.height * 0.6;
      const ox = obs.x + obs.width * 0.25;
      const ow = obs.width * 0.5;
      const oy = obs.y + obs.height * 0.2;
      const oh = obs.height * 0.7;
      return px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy;
    }

    function fetchMockQuiz() {
      const quizzes = [
        {
          question: "React는 어떤 라이브러리인가요?",
          options: ["UI 라이브러리", "데이터베이스", "서버 프레임워크", "운영체제"],
          answer: "UI 라이브러리",
        },
        {
          question: "JavaScript에서 비동기 작업을 처리하는 객체는?",
          options: ["Promise", "Array", "Object", "String"],
          answer: "Promise",
        },
        {
          question: "CSS에서 box-sizing: border-box의 의미는?",
          options: ["padding과 border를 width에 포함", "margin을 width에 포함", "content 영역만 계산", "모든 여백 무시"],
          answer: "padding과 border를 width에 포함",
        }
      ];
      return quizzes[Math.floor(Math.random() * quizzes.length)];
    }

    function showQuiz() {
      const q = fetchMockQuiz();
      setQuiz(q);
    }

    let lastQuizFrame = -1000;
    const quizSpawnInterval = 900;

    function spawnEntities() {
      if (flagShown) return;
      if (flagPushedRef.current) return;

      const canvas = canvasRef.current;

      const x = canvas.width;
      const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
      const candidates = [];


      if (frameRef.current - lastQuizFrame > quizSpawnInterval && Math.random() < 0.2 && quizCountRef.current < 3) {
        candidates.push('quiz');
        quizCountRef.current++;
        lastQuizFrame = frameRef.current;          
      }

      if (Math.random() < 0.6) candidates.push('coin');
      if (Math.random() < 0.8) candidates.push('hurdle');
    


      // entity 생성은 그대로 유지
      candidates.forEach(type => {
        let width, height, y, img;
        const player = playerRef.current;

        if (type === 'hurdle') {
          const idx = Math.floor(Math.random() * hurdleImagesRef.current.length);
          img = hurdleImagesRef.current[idx];
          width = idx === 0 ? canvas.width * 0.1 : canvas.width * 0.08;
          height = idx === 0 ? canvas.height * 0.15 : canvas.height * 0.08;
          y = yBase - height;
        } else if (type === 'coin') {
          img = coinImageRef.current;
          width = canvas.width * 0.04;
          height = width;
          y = yBase - height - player.height * 1.3;
        } else if (type === 'quiz') {
          img = quizBoxImageRef.current;
          width = canvas.width * 0.08;
          height = width;
          y = yBase - height;
        }

        const isTooClose = entitiesRef.current.some(e => Math.abs(e.x - x) < width * 2);
        if (!isTooClose) {
          entitiesRef.current.push({ type, x, y, width, height, img });
        }
      });
    }

    function update() {
      if (gameOver) return;


      const player = playerRef.current;
      const entities = entitiesRef.current;
      let backgroundX = backgroundXRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = canvas.height / bgImg.height;
      const drawW = bgImg.width * scale;
      const drawH = canvas.height;
      backgroundX -= gameSpeedRef.current;
      if (backgroundX <= -drawW) backgroundX = 0;
      for (let x = backgroundX; x < canvas.width; x += drawW) {
        ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, x, 0, drawW, drawH);
      }
      backgroundXRef.current = backgroundX;

      if (!isPaused || !endingRef.current) {
        player.y += player.vy;
        player.vy += player.gravity;
      }
      if (player.y > canvas.height - groundHeightRatio * canvas.height - player.height) {
        player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
        player.isJumping = false;
      }
      ctx.drawImage(playerImageRef.current, player.x, player.y, player.width, player.height);

      if (frameRef.current % 60 === 0 && !isPaused && !endingRef.current) {
        spawnEntities();
      }

      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        if (!isPaused || !endingRef.current) ent.x -= gameSpeedRef.current;

        if (ent.img && ent.img.complete && ent.img.naturalWidth !== 0) {
          ctx.drawImage(ent.img, ent.x, ent.y, ent.width, ent.height);
        }

        if (!isPaused && !endingRef.current && detectCollision(player, ent)) {
          if (ent.type === 'quiz' && !quiz) {
            cancelAnimationFrame(animationIdRef.current);
            snapshotState();
            entities.splice(i, 1);
            setIsPaused(true);
            showQuiz();
            return;
          } else if (ent.type === 'hurdle') {
            scoreRef.current = Math.max(0, scoreRef.current - 5)
            showPenaltyEffect();
            entities.splice(i, 1);
            i--;
          } else if (ent.type === 'coin') {
            scoreRef.current += 5;
            entities.splice(i, 1);
            i--;
          } else if (ent.type === 'flag') {
            endingRef.current = true;
            playerImageRef.current = playerEndImage; // 캐릭터 이미지 변경
            entities.splice(i, 1); // 깃발 제거
          }
        }
      }

      ctx.font = `${canvas.width * 0.02}px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText('Score: ' + scoreRef.current, canvas.width - 200, 50);

      if (!isPaused) {
        frameRef.current++;
        gameSpeedRef.current += 0.002;
      }
      animationIdRef.current = requestAnimationFrame(updateRef.current);

      if (endingRef.current) {
        player.x += 8; // 오른쪽으로 달림
        if (player.x > canvas.width) {
          setGameOver(true); // 결과창 트리거
          cancelAnimationFrame(animationIdRef.current);
        }
      }
    }

    updateRef.current = update;
    requestAnimationFrame(updateRef.current);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', e => {
      const player = playerRef.current;
      if (e.code === 'Space' && !player.isJumping && !gameOver && !isPaused) {
        player.vy = player.jumpForce;
        player.isJumping = true;
      }
    });

    // bgImg.onload = () => update();
    return () => window.removeEventListener('resize', resizeCanvas);

  }, [gameOver]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />

      {quiz && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
          zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', border: '2px solid #000', width: '400px', textAlign: 'center', borderRadius: '10px' }}>
            <h3>{quiz.question}</h3>
            {quiz.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuizAnswer(opt)} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {correctVisible && (
        <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0, 200, 0, 0.8)', padding: '1rem 2rem', borderRadius: '10px', color: 'white', fontSize: '1.5rem', zIndex: 20 }}>
          정답입니다! +50점
        </div>
      )}

      {wrongVisible && (
        <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 0, 0, 0.8)', padding: '1rem 2rem', borderRadius: '10px', color: 'white', fontSize: '1.5rem', zIndex: 20 }}>
          점수 0으로..
        </div>
      )}

      {penaltyVisible && (
        <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 0, 0, 0.8)', padding: '1rem 2rem', borderRadius: '10px', color: 'white', fontSize: '1.5rem', zIndex: 20 }}>
          -10점!
        </div>
      )}

      {gameOver && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', textAlign: 'center' }}>
            <h2>🎉 게임 종료!</h2>
            <p>최종 점수: {scoreRef.current}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem' }}>
              다시 시작
            </button>
          </div>
        </div>
      )}
    </>
  );
}