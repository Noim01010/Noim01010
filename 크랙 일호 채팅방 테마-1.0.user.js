// ==UserScript==
// @name         크랙 일호 채팅방 테마
// @version      1.0
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const imageURL = 'https://i.postimg.cc/RZ6xmP0t/2.png';
  const topDecorationURL = 'https://i.postimg.cc/nhgjVwGf/image.png';
  const styleId = 'bubble-character-style';

  const injectStyle = () => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .message-bubble {
        border-radius: 12px !important;
        font-family: 'Noto Sans KR', sans-serif !important;
        line-height: 1.6;
        padding: 12px;
        position: relative;
      }
      .message-bubble * {
        font-family: inherit !important;
      }
      .message-bubble.css-1oikzkj {
        background-color: #F3F3F5 !important;
        color: #4B4B4B !important;
      }
      .message-bubble.css-1oikzkj em,
      .message-bubble.css-1oikzkj .css-ujv7vi {
        color: #9990B0 !important;
        font-style: normal !important;
      }
      .message-bubble.css-1oikzkj .css-l8rc0l {
        color: #726A88 !important;
      }
      .message-bubble:not(.css-1oikzkj) {
        background-color: #FFF9FB !important;
        color: #C54B6C !important;
      }
      .message-bubble:not(.css-1oikzkj) em,
      .message-bubble:not(.css-1oikzkj) .css-ujv7vi {
        color: #E98FA6 !important;
        font-style: normal !important;
      }
      .message-bubble:not(.css-1oikzkj) .css-l8rc0l {
        color: #D06D88 !important;
      }
      .bubble-with-character {
        position: relative;
      }
      .bubble-character {
        position: absolute;
        top: -50px;
        width: 70px;
        height: 70px;
        z-index: 10;
        pointer-events: none;
      }
      .other-character {
        right: 12px;
      }
      .floating-heart {
        position: absolute;
        font-size: 20px;
        animation: floatHeart 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 20;
      }
      @keyframes floatHeart {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-60px) scale(1.2);
          opacity: 0;
        }
      }
      .top-decoration {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 300px;
        pointer-events: none;
        z-index: 11;
      }
    `;
    document.head.appendChild(style);
  };

  const spawnHeart = (target) => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '💗';
    const offsetX = Math.random() * 20 - 10;
    const offsetY = Math.random() * 5;
    heart.style.left = `${24 + offsetX}px`;
    heart.style.top = `${offsetY}px`;
    target.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  };

  const decorateBubbles = () => {
    document.querySelectorAll('.message-bubble:not(.with-character)').forEach(bubble => {
      bubble.classList.add('bubble-with-character', 'with-character');
      if (!bubble.classList.contains('css-1oikzkj')) {
        const img = document.createElement('img');
        img.src = imageURL;
        img.className = 'bubble-character other-character';
        bubble.appendChild(img);

        const heartInterval = setInterval(() => {
          if (document.body.contains(img)) {
            spawnHeart(img.parentElement);
          } else {
            clearInterval(heartInterval);
          }
        }, 2000 + Math.random() * 1000);

        const deco = document.createElement('img');
        deco.src = topDecorationURL;
        deco.className = 'top-decoration';
        bubble.appendChild(deco);
      }
    });
  };

  const tryInject = () => {
    injectStyle();
    decorateBubbles();
  };

  const observer = new MutationObserver(() => {
    decorateBubbles();
  });

  tryInject();
  observer.observe(document.body, { childList: true, subtree: true });
})();
