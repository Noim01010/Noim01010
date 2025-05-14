// ==UserScript==
// @name         크랙 에이스 채팅방 테마
// @version      1.0+tail
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const selfImageURL = 'https://i.postimg.cc/fWj8mmjQ/image.png';
  const otherImageURL = 'https://i.postimg.cc/gjd412p7/image.png';
  const buttonIconURL = 'https://i.postimg.cc/NF4btvfj/image.png';
  const tailImageURL = 'https://i.postimg.cc/7YjXy9q7/2.png';

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
        background-color: #FFF9DE !important;
        color: #3E3E3E !important;
      }

      .message-bubble.css-1oikzkj em,
      .message-bubble.css-1oikzkj .css-ujv7vi {
        color: #9E7E45 !important;
        font-style: normal !important;
      }

      .message-bubble.css-1oikzkj .css-l8rc0l {
        color: #3E3E3E !important;
      }

      .message-bubble:not(.css-1oikzkj) {
        background-color: #E3E7EA !important;
        color: #000000 !important;
      }

      .message-bubble:not(.css-1oikzkj) em,
      .message-bubble:not(.css-1oikzkj) .css-ujv7vi {
        color: #5A6970 !important;
        font-style: normal !important;
      }

      .message-bubble:not(.css-1oikzkj) .css-l8rc0l {
        color: #000000 !important;
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

      @keyframes tail-wag {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-10deg); }
        100% { transform: rotate(0deg); }
      }

      .bubble-tail {
        animation: tail-wag 0.8s infinite ease-in-out;
        transform-origin: top left;
        position: absolute;
        bottom: -6px;
        right: -28px;
        width: 30px;
        height: auto;
        z-index: 5;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  };

  const decorateBubbles = () => {
    document.querySelectorAll('.message-bubble:not(.with-character)').forEach(bubble => {
      bubble.classList.add('bubble-with-character', 'with-character');

      const img = document.createElement('img');
      img.className = 'bubble-character';

      if (bubble.classList.contains('css-1oikzkj')) {
        img.src = selfImageURL;
        img.classList.add('self-character');
      } else {
        img.src = otherImageURL;
        img.classList.add('other-character');
      }
      bubble.appendChild(img);

      if (!bubble.classList.contains('css-1oikzkj')) {
        const tail = document.createElement('img');
        tail.src = tailImageURL;
        tail.className = 'bubble-tail';
        bubble.appendChild(tail);
      }
    });
  };

  const observer = new MutationObserver(() => {
    if (localStorage.getItem('charImageEnabled') === 'true') {
      decorateBubbles();
    }
  });

  const insertToggleButton = () => {
    
    let panelTarget = document.querySelector('div.css-1v2fve8');
    if (!panelTarget) {
      // 모바일 대응: 비슷한 역할을 하는 버튼 영역 찾아 fallback
      panelTarget = document.querySelector('main div[class*="Panel"]') || document.querySelector('main div[class*="panel"]');
    }
    
    if (!panelTarget || document.querySelector('#charImgToggleBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'charImgToggleBtn';
    btn.innerHTML = `<img src="${buttonIconURL}" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">💬 스킨 적용`;
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
      btn.innerHTML = `<img src="${buttonIconURL}" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">💬 스킨 해제`;
    }

    btn.addEventListener('click', () => {
      enabled = !enabled;
      localStorage.setItem('charImageEnabled', enabled);
      if (enabled) {
        injectStyle();
        decorateBubbles();
        btn.innerHTML = `<img src="${buttonIconURL}" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">💬 스킨 해제`;
      } else {
        document.querySelectorAll('.with-character').forEach(el => {
          el.classList.remove('with-character', 'bubble-with-character');
          const img = el.querySelector('.bubble-character');
          const tail = el.querySelector('.bubble-tail');
          if (img) img.remove();
          if (tail) tail.remove();
        });
        btn.innerHTML = `<img src="${buttonIconURL}" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">💬 스킨 적용`;
      }
    });

    panelTarget.appendChild(btn);
  };

  window.addEventListener('load', () => {
    insertToggleButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
