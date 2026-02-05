/**
 * CoderDojo 西条 - コンポーネントローダー
 * ヘッダー・フッターなどの共通パーツを読み込む
 */

/**
 * HTML コンポーネントを読み込んで挿入する
 * @param {string} path - HTML ファイルのパス
 * @param {string} targetId - 挿入先の要素ID
 */
async function loadComponent(path, targetId) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const target = document.getElementById(targetId);
    if (target) {
      target.innerHTML = html;
    }
  } catch (error) {
    console.error(`コンポーネント読み込みエラー (${path}):`, error);
  }
}

/**
 * ヘッダーを読み込む
 */
async function loadHeader() {
  await loadComponent(CONFIG.paths.header, 'header-container');
}

/**
 * フッターを読み込む
 */
async function loadFooter() {
  await loadComponent(CONFIG.paths.footer, 'footer-container');
}

/**
 * 全ての共通コンポーネントを読み込む
 */
async function loadAllComponents() {
  await Promise.all([loadHeader(), loadFooter()]);
}
