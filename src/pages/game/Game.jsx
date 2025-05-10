import React, { useEffect, useRef, useState } from 'react';
import playerImg from '../../assets/player.png';
import hurdle1Img from '../../assets/hurdle1.png';
import hurdle2Img from '../../assets/hurdle2.png';
import coinImg from '../../assets/coin.png';
import quizBoxImg from '../../assets/quizpop.png';
import backgroundImg from '../../assets/game-background.png';

export default function Game() {
  const canvasRef = useRef(null);
  const updateRef = useRef(null);
  const animationIdRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [penaltyVisible, setPenaltyVisible] = useState(false);
  const [correctVisible, setCorrectVisible] = useState(false);

  function handleQuizAnswer(answer) {
    if (!quiz) return;

    if (answer === quiz.answer) {
      setScore(prev => prev + 300);
      setQuiz(null);
      setIsPaused(false); // 다시 움직이도록
    
      setCorrectVisible(true);
      setTimeout(() => setCorrectVisible(false), 1000);
      // ❌ requestAnimationFrame 호출 안 해도 돼 — update()는 계속 돌고 있으니까!
    }
  }

  function showPenaltyEffect() {
    setPenaltyVisible(true);
    setTimeout(() => setPenaltyVisible(false), 800);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const bgImg = new Image(); bgImg.src = backgroundImg;
    const playerImage = new Image(); playerImage.src = playerImg;
    const hurdleImages = [new Image(), new Image()];
    hurdleImages[0].src = hurdle1Img; hurdleImages[1].src = hurdle2Img;
    const coinImage = new Image(); coinImage.src = coinImg;
    const quizBoxImage = new Image(); quizBoxImage.src = quizBoxImg;

    let backgroundX = 0;
    const groundHeightRatio = 0.15;

    const player = {
      x: 100, y: 0, width: 0, height: 0,
      vy: 0, gravity: 2, jumpForce: -28, isJumping: false,
    };

    let entities = [];
    let frame = 0;
    let gameSpeed = 7;
    let backgroundSpeed = gameSpeed;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player.width = canvas.width * 0.1;
      player.height = canvas.height * 0.28;
      player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
    }

    function detectCollision(player, obs) {
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
      return {
        question: "React는 어떤 라이브러리인가요?",
        options: ["UI 라이브러리", "데이터베이스", "서버 프레임워크", "운영체제"],
        answer: "UI 라이브러리",
      };
    }

    function showQuiz() {
      const q = fetchMockQuiz();
      setQuiz(q);
    }

    let lastQuizFrame = -1000;
    const quizSpawnInterval = 900;

    function spawnEntities() {
      const x = canvas.width;
      const yBase = canvas.height - groundHeightRatio * canvas.height;

      const candidates = [];

      if (frame - lastQuizFrame > quizSpawnInterval && Math.random() < 0.2) {
        candidates.push('quiz');
        lastQuizFrame = frame;
      }
      if (Math.random() < 0.6) candidates.push('coin');
      if (Math.random() < 0.8) candidates.push('hurdle');

      candidates.forEach(type => {
        let width, height, y;
        let img;

        if (type === 'hurdle') {
          const idx = Math.floor(Math.random() * hurdleImages.length);
          img = hurdleImages[idx];
          width = idx === 0 ? canvas.width * 0.1 : canvas.width * 0.08;
          height = idx === 0 ? canvas.height * 0.15 : canvas.height * 0.08;
          y = yBase - height;
        } else if (type === 'coin') {
          img = coinImage;
          width = canvas.width * 0.04;
          height = width;
          y = yBase - height - player.height * 1.3;
        } else if (type === 'quiz') {
          img = quizBoxImage;
          width = canvas.width * 0.08;
          height = width;
          y = yBase - height;
        }

        const isTooClose = entities.some(e => Math.abs(e.x - x) < width * 2);
        if (!isTooClose) {
          entities.push({ type, x, y, width, height, img });
        }
      });
    }

    function update() {
      if (gameOver || isPaused) return; // 퀴즈 중이거나 게임 종료 시 루프 멈춤

      const canvas = canvasRef.current;
   
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // 배경 그리기
      const scale = canvas.height / bgImg.height;
      const drawW = bgImg.width * scale;
      const drawH = canvas.height;
      backgroundX -= backgroundSpeed;
      if (backgroundX <= -drawW) backgroundX = 0;
      for (let x = backgroundX; x < canvas.width; x += drawW) {
        ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, x, 0, drawW, drawH);
      }
    
      // 캐릭터 물리
      const p = player.current;
      player.y += player.vy;
      player.vy += player.gravity;
      if (player.y > canvas.height - groundHeightRatio * canvas.height - player.height) {
        player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
        player.isJumping = false;
      }
      ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    
      // 60 프레임마다 엔티티 생성
      if (frame % 60 === 0) {
        spawnEntities();
      }
    
      // === 먼저: 퀴즈 충돌 검사 및 즉시 루프 종료 ===
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        ent.x -= gameSpeed;
        ctx.drawImage(ent.img, ent.x, ent.y, ent.width, ent.height);
    
        if (detectCollision(player, ent) && ent.type === 'quiz' && !quiz) {
          setIsPaused(true);
          showQuiz();
          entities.splice(i, 1); // 퀴즈 박스만 제거
          return; // 💥 루프 중단 → 이후 장애물/코인 충돌도 안 생김
        }
      }
    
      // === 이후: 코인, 장애물 충돌 검사 ===
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        if (detectCollision(player, ent)) {
          if (ent.type === 'hurdle') {
            setScore(prev => Math.max(0, prev - 10));
            showPenaltyEffect();
            entities.splice(i, 1);
            i--;
          } else if (ent.type === 'coin') {
            setScore(prev => prev + 100);
            entities.splice(i, 1);
            i--;
          }
        }
      }
    
      // 점수 및 텍스트 표시
      ctx.font = `${canvas.width * 0.02}px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText('Score: ' + score, canvas.width - 200, 50);
    
      // 점수/속도 업데이트
      gameSpeed += 0.002;
      frame++;
      setScore(prev => prev + 1);
    
      // 다음 프레임 예약
      animationIdRef.current = requestAnimationFrame(update);
    }
        

    updateRef.current = update;

    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && !player.isJumping && !gameOver) {
        player.vy = player.jumpForce;
        player.isJumping = true;
      }
    });
    bgImg.onload = () => update();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [gameOver, quiz]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />

      {quiz && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10, display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', border: '2px solid #000',
            width: '400px', textAlign: 'center', borderRadius: '10px'
          }}>
            <h3>{quiz.question}</h3>
            {quiz.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleQuizAnswer(opt)}
                style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {correctVisible && (
        <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 200, 0, 0.8)', padding: '1rem 2rem',
          borderRadius: '10px', color: 'white', fontSize: '1.5rem', zIndex: 20
        }}>
          정답입니다!
        </div>
      )}

      {penaltyVisible && (
        <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)', padding: '1rem 2rem',
          borderRadius: '10px', color: 'white', fontSize: '1.5rem', zIndex: 20
        }}>
          -10점!
        </div>
      )}

      {gameOver && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h2>오답! 게임 오버!</h2>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem' }}>
              다시 시작
            </button>
          </div>
        </div>
      )}
    </>
  );
}