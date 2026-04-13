// source/js/tts.js

document.addEventListener('DOMContentLoaded', function() {
  initBodyTTS();
  initMarkmapTTS();
});

/**
 * 1. 处理正文中的 <span class="word-tts">
 */
function initBodyTTS() {
  if (!window.speechSynthesis) return;

  const ttsElements = document.querySelectorAll('.word-tts');
  ttsElements.forEach(element => {
    // 避免重复初始化
    if (element.parentNode.classList.contains('word-tts-container')) return;

    const container = document.createElement('span');
    container.className = 'word-tts-container';
    
    const icon = document.createElement('span');
    icon.className = 'tts-icon';
    icon.innerHTML = '🔊';
    
    element.parentNode.insertBefore(container, element);
    container.appendChild(element);
    container.appendChild(icon);

    container.addEventListener('click', (e) => {
      e.stopPropagation();
      speakWord(element.innerText.trim(), container);
    });
  });
}

/**
 * 2. 处理 Markmap SVG 中的加粗单词
 */
function initMarkmapTTS() {
  if (!window.speechSynthesis) return;

  // 使用 MutationObserver 监听 DOM 变化，因为 Markmap 是异步渲染的
  const observer = new MutationObserver((mutations) => {
    let shouldAttach = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'svg' || node.querySelector('svg')) {
            shouldAttach = true;
          }
        }
      });
    });
    
    if (shouldAttach) {
      // 稍微延迟以确保 SVG 内容完全渲染
      setTimeout(() => {
        document.querySelectorAll('.markmap svg').forEach(svg => {
          attachTTSToSvg(svg);
        });
      }, 100);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始检查
  setTimeout(() => {
    document.querySelectorAll('.markmap').forEach(svg => {
      attachTTSToSvg(svg);
    });
  }, 500);
}
function attachTTSToSvg(svg) {
  if (!svg || svg.dataset.ttsAttached) return;
  svg.dataset.ttsAttached = "true";

  svg.addEventListener('click', (e) => {
    let targetNode = null;
    let word = '';

    // 1. 尝试查找标准的 HTML strong 标签
    let strongParent = e.target.closest('strong');
    
    // 2. 如果没找到 strong，尝试查找 Markmap 特有的加粗类名 .mm-strong
    if (!strongParent) {
      strongParent = e.target.closest('.mm-strong');
    }

    if (strongParent) {
      targetNode = strongParent;
      word = strongParent.innerText || strongParent.textContent;
    }

    if (targetNode && word) {
      word = word.trim();
      if (/^[a-zA-Z\-]+$/.test(word)) {
        // 添加视觉反馈类名
        targetNode.classList.add('tts-enabled');
        speakWord(word, null, targetNode);
      }
    }
  });
  
  // 初始遍历：给所有现有的加粗节点添加 cursor 提示
  // 这样用户即使不点击，鼠标放上去也能看到手型
  const existingStrong = svg.querySelectorAll('strong, .mm-strong');
  existingStrong.forEach(node => {
    const text = node.innerText || node.textContent;
    if (text && /^[a-zA-Z\-]+$/.test(text.trim())) {
      node.classList.add('tts-enabled');
      // 添加原生 title 提示，鼠标悬停会显示 "Click to pronounce"
      node.setAttribute('title', 'Click to pronounce: ' + text.trim());
    }
  });
}

/**
 * 发音函数
 */
function speakWord(text, container = null, svgElement = null) {
  if (!text) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  utterance.pitch = 1;

  if (container) {
    container.classList.add('playing');
  } else if (svgElement) {
    // 添加播放中类名
    svgElement.classList.add('tts-playing');
    
    utterance.onend = () => {
      svgElement.classList.remove('tts-playing');
    };
    
    utterance.onerror = () => {
      svgElement.classList.remove('tts-playing');
    };
  }

  utterance.onend = () => {
    if (container) container.classList.remove('playing');
  };
  
  utterance.onerror = () => {
    if (container) container.classList.remove('playing');
  };

  window.speechSynthesis.speak(utterance);
}