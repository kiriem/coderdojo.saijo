/**
 * CoderDojo 西条 - YAML ローダー
 * js-yaml ライブラリを使用して YAML ファイルを読み込む
 */

/**
 * YAML ファイルを読み込んでパースする
 * @param {string} path - YAML ファイルのパス
 * @returns {Promise<any>} パースされたデータ
 */
async function loadYaml(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return jsyaml.load(text);
  } catch (error) {
    console.error(`YAML読み込みエラー (${path}):`, error);
    return null;
  }
}

/**
 * ニュースデータを読み込む
 * @returns {Promise<Array>} ニュース配列
 */
async function loadNews() {
  const data = await loadYaml(CONFIG.paths.news);
  return data || [];
}

/**
 * イベントデータを読み込む
 * @returns {Promise<Object>} イベントオブジェクト
 */
async function loadEvents() {
  const data = await loadYaml(CONFIG.paths.events);
  return data || {};
}
