// ==UserScript==
// @name         크랙 채팅방 권우연 테마
// @description  유저/상대 메시지 색상 완전 분리 + 캐릭터 아이콘 + 스킨 토글
// @version      5.0-final
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const imageURL = 'https://i.postimg.cc/TYWcbtWP/image.png'; // 캐릭터 이미지 링크
  const styleId = 'bubble-character-style';

  const injectStyle = () => {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 공통 말풍선 스타일 */
      .message-bubble {
        border-radius: 12px !important;
        font-family: 'Noto Sans KR', sans-serif !important;
        line-height: 1.5;
        padding: 12px;
      }

      .message-bubble * {
        font-family: inherit !important;
      }

      /* 🧍‍♀️ 내 메시지 */
      .message-bubble.css-1oikzkj {
        background-color: #FFFbDE !important;
        color: #328E6E !important; /* 대화 텍스트 */
      }

      .message-bubble.css-1oikzkj em,
      .message-bubble.css-1oikzkj .css-ujv7vi {
        color: #90D1CA !important; /* 강조 서술 (em) */
        font-style: normal !important;
      }

      .message-bubble.css-1oikzkj .css-l8rc0l {
        color: #096B68 !important; /* 일반 서술 */
      }

      /* 👤 상대 메시지 */
      .message-bubble:not(.css-1oikzkj) {
        background-color: #9EBC8A !important;
        color: #3F7D58 !important; /* 대화 텍스트 */
      }

      .message-bubble:not(.css-1oikzkj) em,
      .message-bubble:not(.css-1oikzkj) .css-ujv7vi {
        color: #537D5D !important; /* 강조 서술 (em) */
        font-style: normal !important;
      }

      .message-bubble:not(.css-1oikzkj) .css-l8rc0l {
        color: #626F47 !important; /* 일반 서술 */
      }

      /* 캐릭터 이미지 아이콘 위치 */
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
    `;
    document.head.appendChild(style);
  };

  const decorateBubbles = () => {
    document.querySelectorAll('.message-bubble:not(.with-character)').forEach(bubble => {
      bubble.classList.add('bubble-with-character', 'with-character');

      const img = document.createElement('img');
      img.src = imageURL;
      img.className = 'bubble-character';

      if (bubble.classList.contains('css-1oikzkj')) {
        img.classList.add('self-character');
      } else {
        img.classList.add('other-character');
      }

      bubble.appendChild(img);
    });
  };

  const observer = new MutationObserver(() => {
    if (localStorage.getItem('charImageEnabled') === 'true') {
      decorateBubbles();
    }
  });

  const insertToggleButton = () => {
    const panelTarget = document.querySelector('div.css-1v2fve8');
    if (!panelTarget || document.querySelector('#charImgToggleBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'charImgToggleBtn';
    btn.textContent = '💬 스킨 적용';
    btn.style.marginTop = '16px';
    btn.style.padding = '10px 16px';
    btn.style.borderRadius = '8px';
    btn.style.border = '1px solid #ccc';
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = '#fff';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '14px';

    let enabled = localStorage.getItem('charImageEnabled') === 'true';
    if (enabled) {
      injectStyle();
      decorateBubbles();
      btn.textContent = '💬 스킨 해제';
    }

    btn.addEventListener('click', () => {
      enabled = !enabled;
      localStorage.setItem('charImageEnabled', enabled);
      if (enabled) {
        injectStyle();
        decorateBubbles();
        btn.textContent = '💬 스킨 해제';
      } else {
        document.querySelectorAll('.with-character').forEach(el => {
          el.classList.remove('with-character', 'bubble-with-character');
          const img = el.querySelector('.bubble-character');
          if (img) img.remove();
        });
        btn.textContent = '💬 스킨 적용';
      }
    });

    panelTarget.appendChild(btn);
  };

  window.addEventListener('load', () => {
    insertToggleButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
