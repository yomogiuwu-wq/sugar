// --- 1. 変数定義の一本化 ---
const secretWindow = document.getElementById("secret-window");
const windowHeader = document.getElementById("window-header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (windowHeader && secretWindow) {
  windowHeader.onmousedown = function(e) {
    isDragging = true;

    // 現在のウィンドウの「ページ全体から見た位置」を取得
    const rect = secretWindow.getBoundingClientRect();
    
    // マウス位置とウィンドウ左上の「差」を固定（スクロール分も考慮）
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // absoluteに切り替え（親要素 interface-wrapper が relative である前提）
    secretWindow.style.position = 'absolute';
    windowHeader.style.cursor = "grabbing";
    
    e.preventDefault();
  };
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  // 親要素（interface-wrapper）の画面上の位置をリアルタイムで取得
  const wrapperRect = document.querySelector('.interface-wrapper').getBoundingClientRect();

  // 【横座標の修正】
  // マウスの画面位置(clientX) から「親の左端(left)」と「掴んだ位置(offsetX)」を引く
  let x = e.clientX - wrapperRect.left - offsetX;
  
  // 【縦座標の修正】
  // absoluteの場合、親要素内の上端からの距離にするため、rect.topは引かずにoffsetXで調整
  let y = e.clientY - wrapperRect.top - offsetY;

  secretWindow.style.left = x + "px";
  secretWindow.style.top = y + "px";
});

  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (windowHeader) windowHeader.style.cursor = "grab";
  });
}

// フォルダを開くときの初期位置も調整
function toggleFolder() {
  if (!secretWindow) return;
  if (secretWindow.style.display === 'none' || secretWindow.style.display === '') {
    // 今のスクロール位置の少し下に出現させる
    secretWindow.style.top = (window.scrollY + 100) + "px";
    secretWindow.style.left = "50px";
    secretWindow.style.display = 'block';
  } else {
    secretWindow.style.display = 'none';
  }
}

// --- 4. 馬鹿モード (Baka Mode) ---
function goBakaMode() {
    const content = document.querySelector('.content-text');
    const winBody = document.getElementById('window-body');

    document.body.classList.toggle('baka-mode');

    if (document.body.classList.contains('baka-mode')) {
        if (content) {
            originalContent = content.innerHTML;
            content.innerText = "(^q^) ｱｳｱｳ、あーかーいーデータがいっぱいだおｗｗｗｗ";
        }
        if (winBody) {
            originalWinBody = winBody.innerHTML;
            winBody.innerHTML = `
                <p>( ﾟдﾟ) ｴﾗｰ発生中だお</p>
                <button onclick="goBakaMode()">[ 治す ]</button>
            `;
        }
        if (secretWindow && secretWindow.style.display === 'none') toggleFolder();
    } else {
        if (content) content.innerHTML = originalContent;
        if (winBody) winBody.innerHTML = originalWinBody;
    }
}

// --- 5. ローダー & ページ読み込み時の処理 ---
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const percentText = document.getElementById('percent');

  // 【初回判定の追加】
  // すでに一度読み込んだかチェック
  if (sessionStorage.getItem('isLoaded')) {
    // 2回目以降ならローダーを即座に消す
    if (loader) loader.style.display = 'none';
    return; // 以降のカウントアップ処理を中止
  }

  // --- 初回のみ実行される処理 ---
  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 15);
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      
      // 読み込み完了フラグを保存
      sessionStorage.setItem('isLoaded', 'true');

      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
      }, 500);
    }
    if (percentText) percentText.innerText = count;
  }, 60);
});

// --- 6. リンクの404チェック ---
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const url = this.getAttribute('href');
        if (!url || url.startsWith('http') || url.startsWith('#')) return;
        
        e.preventDefault();
        fetch(url, { method: 'HEAD' })
            .then(res => {
                window.location.href = res.ok ? url : '404.html';
            })
            .catch(() => {
                window.location.href = '404.html';
            });
    });
});