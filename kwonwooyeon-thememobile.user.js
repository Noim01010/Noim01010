// ==UserScript==
// @name         크랙 채팅방 권우연 테마 (모바일 대응)
// @description  유저/상대 메시지 색상 분리 + 캐릭터 아이콘 + 스킨 토글 (PC/모바일)
// @version      5.1-mobile
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

      #charImgToggleBtn {
        margin-top: 16px;
        padding: 10px 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        cursor: pointer;
        background-color: #fff;
        font-weight: bold;
        font-size: 14px;
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

  const insertToggleButton = () => {
    const checkPanel = () =>
      document.querySelector('div.css-1v2fve8') ||
      document.querySelector('[class*="css-"][class*="Panel"]') || // 모바일 대응용
      document.querySelector('header');

    const panelTarget = checkPanel();
    if (!panelTarget || document.getElementById('charImgToggleBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'charImgToggleBtn';
    btn.textContent = '💬 스킨 적용';

    let enabled = localStorage.getItem('charImageEnabled') === 'true';
    if (enabled) {
      injectStyle();
      decorateBubbles();
      btn.textContent = '💬 스킨 해제';
    }

    btn.onclick = () => {
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
    };

    panelTarget.appendChild(btn);
  };

  const tryInject = () => {
    if (document.readyState === 'complete') {
      insertToggleButton();
    } else {
      window.addEventListener('DOMContentLoaded', insertToggleButton);
    }
  };

  const observer = new MutationObserver(() => {
    if (localStorage.getItem('charImageEnabled') === 'true') {
      decorateBubbles();
    }

    insertToggleButton(); // 모바일에서 버튼이 늦게 생기는 것 대응
  });

  tryInject();
  observer.observe(document.body, { childList: true, subtree: true });
})();
