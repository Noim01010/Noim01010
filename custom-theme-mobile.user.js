// ==UserScript==
// @name         크랙 말풍선 커스텀 스킨 (모바일 대응)
// @version      1.4
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const styleId = 'custom-chat-skin-style';
  const defaultColors = {
    myBg: '#FFFbDE',
    myNarr: '#90D1CA',
    myNarrPlain: '#096B68',
    otherBg: '#9EBC8A',
    otherNarr: '#537D5D'
  };

  const getColor = (key) => localStorage.getItem(key) || defaultColors[key];

  const injectStyle = () => {
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

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
        background-color: ${getColor('myBg')} !important;
        color: inherit !important;
      }
      .message-bubble.css-1oikzkj em,
      .message-bubble.css-1oikzkj .css-ujv7vi {
        color: ${getColor('myNarr')} !important;
        font-style: normal !important;
      }
      .message-bubble.css-1oikzkj .css-l8rc0l {
        color: ${getColor('myNarrPlain')} !important;
      }
      .message-bubble:not(.css-1oikzkj) {
        background-color: ${getColor('otherBg')} !important;
        color: inherit !important;
      }
      .message-bubble:not(.css-1oikzkj) em,
      .message-bubble:not(.css-1oikzkj) .css-ujv7vi {
        color: ${getColor('otherNarr')} !important;
        font-style: normal !important;
      }
    `;
    document.head.appendChild(style);
  };

  const createSettingsPanel = () => {
    if (document.querySelector('#skinColorPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'skinColorPanel';
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.zIndex = '9999';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    panel.style.display = 'none';
    panel.style.maxWidth = '90vw';
    panel.innerHTML = `
      <strong style="display:block;margin-bottom:8px;">🎨 말풍선 색상 설정</strong>
      <label>내 말풍선 배경 <input type="color" id="myBg" value="${getColor('myBg')}"></label><br>
      <label>내 서술(em) <input type="color" id="myNarr" value="${getColor('myNarr')}"></label><br>
      <label>내 일반서술 <input type="color" id="myNarrPlain" value="${getColor('myNarrPlain')}"></label><br>
      <hr>
      <label>상대 말풍선 배경 <input type="color" id="otherBg" value="${getColor('otherBg')}"></label><br>
      <label>상대 서술(em) <input type="color" id="otherNarr" value="${getColor('otherNarr')}"></label><br>
      <button id="applySkin" style="margin-top:10px">💾 적용</button>
      <button id="resetSkin" style="margin-top:10px; float:right">↩ 초기화</button><br>
      <button id="closeSkinPanel" style="margin-top:10px; width:100%">❌ 닫기</button>
    `;
    document.body.appendChild(panel);

    document.getElementById('applySkin').onclick = () => {
      Object.keys(defaultColors).forEach(key => {
        const value = document.getElementById(key).value;
        localStorage.setItem(key, value);
      });
      injectStyle();
    };

    document.getElementById('resetSkin').onclick = () => {
      Object.keys(defaultColors).forEach(key => {
        localStorage.removeItem(key);
        document.getElementById(key).value = defaultColors[key];
      });
      injectStyle();
    };

    document.getElementById('closeSkinPanel').onclick = () => {
      panel.style.display = 'none';
    };
  };

  const insertToggleButton = () => {
    if (document.querySelector('#skinToggleBtn')) return;

    const observer = new MutationObserver(() => {
      const label = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('상황 이미지 보기'));
      if (!label) return;
      const parentBlock = label.closest('.css-j7qwjs') || label.closest('div');
      if (!parentBlock) return;

      if (document.querySelector('#skinToggleBtn')) return;

      const btn = document.createElement('button');
      btn.id = 'skinToggleBtn';
      btn.textContent = '🎨 스킨 설정';
      btn.style.margin = '10px 0';
      btn.style.padding = '6px 12px';
      btn.style.fontSize = '14px';
      btn.style.borderRadius = '6px';
      btn.style.border = '1px solid #ccc';
      btn.style.cursor = 'pointer';
      btn.style.backgroundColor = '#fff';
      btn.style.width = '100%';

      btn.onclick = () => {
        const panel = document.getElementById('skinColorPanel');
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
      };

      parentBlock.appendChild(btn);
      observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  window.addEventListener('load', () => {
    injectStyle();
    createSettingsPanel();
    insertToggleButton();
  });
})();
