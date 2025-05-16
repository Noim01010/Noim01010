// ==UserScript==
// @name         크랙 채팅방 권우연 테마
// @version      1.0
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const imageURL = 'https://i.postimg.cc/TYWcbtWP/image.png';
  const styleId = 'bubble-character-style';

  const injectStyle = () => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .message-bubble {
        border-radius: 12px !important;
        font-family: 'Noto Sans KR', sans-serif !important;
        line-height: 1.5;
        padding: 12px;
        position: relative;
      }
      .message-bubble * {
        font-family: inherit !important;
      }
      .message-bubble.css-1oikzkj {
        background-color: #FFFbDE !important;
        color: #328E6E !important;
      }
      .message-bubble.css-1oikzkj em,
      .message-bubble.css-1oikzkj .css-ujv7vi {
        color: #90D1CA !important;
        font-style: normal !important;
      }
      .message-bubble.css-1oikzkj .css-l8rc0l {
        color: #096B68 !important;
      }
      .message-bubble:not(.css-1oikzkj) {
        background-color: #9EBC8A !important;
        color: #3F7D58 !important;
      }
      .message-bubble:not(.css-1oikzkj) em,
      .message-bubble:not(.css-1oikzkj) .css-ujv7vi {
        color: #537D5D !important;
        font-style: normal !important;
      }
      .message-bubble:not(.css-1oikzkj) .css-l8rc0l {
        color: #626F47 !important;
      }
      .bubble-with-character {
        position: relative;
      }
      .bubble-character {
        position: absolute;
        top: -36px;
        width: 48px;
        height: 48px;
        z-index: 10;
        pointer-events: none;
      }
      .self-character {
        left: 12px;
      }
      .other-character {
        right: 12px;
      }

      .floating-clover {
        position: absolute;
        font-size: 20px;
        animation: floatClover 1.8s ease-out forwards;
        pointer-events: none;
        z-index: 20;
      }

      @keyframes floatClover {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-60px) scale(1.2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const spawnClover = (target) => {
    const clover = document.createElement('div');
    clover.className = 'floating-clover';
    clover.textContent = '🍀';
    const offsetX = Math.random() * 20 - 10;
    const offsetY = Math.random() * 5;
    clover.style.left = `${24 + offsetX}px`;
    clover.style.top = `${offsetY}px`;
    target.appendChild(clover);
    setTimeout(() => clover.remove(), 1800);
  };

  const decorateBubbles = () => {
    document.querySelectorAll('.message-bubble:not(.with-character)').forEach(bubble => {
      bubble.classList.add('bubble-with-character', 'with-character');

      // 캐릭터 이미지
      const img = document.createElement('img');
      img.src = imageURL;
      img.className = 'bubble-character';
      if (bubble.classList.contains('css-1oikzkj')) {
        img.classList.add('self-character');
      } else {
        img.classList.add('other-character');
      }
      bubble.appendChild(img);

      // 🍀 클로버 뿅뿅 날리기 (지속 반복)
      const cloverInterval = setInterval(() => {
        if (document.body.contains(bubble)) {
          spawnClover(bubble);
        } else {
          clearInterval(cloverInterval);
        }
      }, 2500 + Math.random() * 1000);
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
