import React, { useEffect, useRef, useState } from 'react';
import playerImg from '../../assets/player.png';
import hurdle1Img from '../../assets/hurdle1.png';
import hurdle2Img from '../../assets/hurdle2.png';
import backgroundImg from '../../assets/game-background.png';

export default function Game() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const bgImg = new Image();
    bgImg.src = backgroundImg;

    const playerImage = new Image();
    playerImage.src = playerImg;

    const hurdleImages = [new Image(), new Image()];
    hurdleImages[0].src = hurdle1Img;
    hurdleImages[1].src = hurdle2Img;

    let backgroundX = 0;
    const backgroundSpeed = 5;
    const groundHeightRatio = 0.15;

    const player = {
      x: 100,
      y: 0,
      width: 0,
      height: 0,
      vy: 0,
      gravity: 2,
      jumpForce: -28,
      isJumping: false,
    };

    const obstacles = [];
    let frame = 0;
    let score = 0;
    let gameSpeed = 10;
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    
      player.width = canvas.width * 0.08;
      player.height = canvas.height * 0.28;
      player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
    
      for (let obs of obstacles) {
        const newWidth = canvas.width * 0.08;
        const newHeight = (obs.img.height / obs.img.width) * newWidth;
        obs.width = newWidth;
        obs.height = newHeight;
        obs.y = canvas.height - groundHeightRatio * canvas.height - obs.height;
      }
    }

    function restartGame() {
      score = 0;
      frame = 0;
      backgroundX = 0;
      player.vy = 0;
      player.isJumping = false;
      player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
      obstacles.length = 0;
      setGameOver(false);
      requestAnimationFrame(update);
    }

    function detectCollision(player, obs) {
      const px = player.x + player.width * 0.15;
      const pw = player.width * 0.4;
      const py = player.y + player.height * 0.;
      const ph = player.height * 0.85;

      const ox = obs.x + obs.width * 0.1;
      const ow = obs.width * 0.7;
      const oy = obs.y;
      const oh = obs.height;

      return (
        px < ox + ow &&
        px + pw > ox &&
        py < oy + oh &&
        py + ph > oy
      );
    }

    function spawnObstacle() {
      const idx = Math.floor(Math.random() * hurdleImages.length);
      const img = hurdleImages[idx];
      const width = canvas.width * 0.08;
      const height = (img.height / img.width) * width;
      obstacles.push({
        x: canvas.width,
        y: canvas.height - groundHeightRatio * canvas.height - height,
        width,
        height,
        img,
      });
    }

    function update() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const backgroundScale = canvas.height / bgImg.height;
      const backgroundDrawHeight = canvas.height;
      const backgroundDrawWidth = bgImg.width * backgroundScale;

      backgroundX -= backgroundSpeed;
      if (backgroundX <= -backgroundDrawWidth) {
        backgroundX = 0;
      }

      let drawX = backgroundX;
      while (drawX < canvas.width) {
        ctx.drawImage(
          bgImg,
          0, 0, bgImg.width, bgImg.height,
          drawX, 0, backgroundDrawWidth, backgroundDrawHeight
        );
        drawX += backgroundDrawWidth;
      }


      player.y += player.vy;
      player.vy += player.gravity;

      if (player.y > canvas.height - groundHeightRatio * canvas.height - player.height) {
        player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
        player.isJumping = false;
      }

      ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

      if (frame % 120 === 0) {
        spawnObstacle();
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);

        if (detectCollision(player, obs)) {
          alert(`게임 오버!\n점수: ${score}`);
          window.location.reload();
          return;
        }

      }

      score++;
      ctx.font = `${canvas.width * 0.02}px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText('Score: ' + score, canvas.width - 200, 50);

      frame++;
      animationId = requestAnimationFrame(update);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !player.isJumping && !gameOver) {
        player.vy = player.jumpForce;
        player.isJumping = true;
      }
    });

    bgImg.onload = () => update();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [gameOver]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
