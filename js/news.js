/**
 * CoderDojo 西条 - ニュース表示モジュール
 */

// ニュースデータのキャッシュ
let newsCache = null;

/**
 * ニュースデータを取得（キャッシュ付き）
 * @returns {Promise<Array>} ニュース配列
 */
async function getNews() {
  if (newsCache === null) {
    newsCache = await loadNews();
  }
  return newsCache;
}

/**
 * 日付をフォーマットする
 * @param {string} dateStr - 日付文字列 (YYYY-MM-DD)
 * @returns {string} フォーマット済み日付
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * カテゴリバッジの HTML を生成
 * @param {string} category - カテゴリ名
 * @returns {string} HTML 文字列
 */
function createCategoryBadge(category) {
  const cat = CONFIG.categories[category] || CONFIG.categories.notice;
  return `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${cat.bgColor} ${cat.textColor} border ${cat.borderColor} uppercase">${cat.label}</span>`;
}

/**
 * ニュースアイテムの HTML を生成（一覧用）
 * @param {Object} news - ニュースオブジェクト
 * @returns {string} HTML 文字列
 */
function createNewsListItem(news) {
  const link = news.externalLink || `news-detail.html?id=${news.id}`;
  const target = news.externalLink ? ' target="_blank" rel="noopener"' : '';

  return `
    <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-colors border-b border-[#e7f3ea] dark:border-[#1a2e1e]">
      <span class="text-sm font-medium text-[#4c6a51] whitespace-nowrap">${formatDate(news.date)}</span>
      ${createCategoryBadge(news.category)}
      <a class="text-sm font-bold flex-1 truncate hover:text-primary" href="${link}"${target}>${news.title}</a>
      <span class="material-symbols-outlined text-sm">chevron_right</span>
    </div>
  `;
}

/**
 * ニュースカードの HTML を生成（一覧ページ用）
 * @param {Object} news - ニュースオブジェクト
 * @returns {string} HTML 文字列
 */
function createNewsCard(news) {
  const link = news.externalLink || `news-detail.html?id=${news.id}`;
  const target = news.externalLink ? ' target="_blank" rel="noopener"' : '';

  return `
    <a href="${link}"${target} class="block p-6 bg-white dark:bg-[#1a2e1e] rounded-xl shadow-sm hover:shadow-md transition-all border border-[#e7f3ea] dark:border-[#2a4d34] group" data-category="${news.category}">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-sm text-[#4c6a51]">${formatDate(news.date)}</span>
        ${createCategoryBadge(news.category)}
      </div>
      <h3 class="font-bold text-lg mb-2 group-hover:text-primary transition-colors">${news.title}</h3>
      <p class="text-sm text-[#4c6a51] dark:text-gray-400 line-clamp-2">${news.summary}</p>
    </a>
  `;
}

/**
 * トップページにニュースプレビューを表示
 * @param {string} containerId - コンテナ要素のID
 * @param {number} limit - 表示件数
 */
async function renderNewsPreview(containerId, limit = CONFIG.newsPreviewCount) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const news = await getNews();
  const items = news.slice(0, limit);

  if (items.length === 0) {
    container.innerHTML = '<p class="text-[#4c6a51] p-4">お知らせはありません。</p>';
    return;
  }

  container.innerHTML = items.map(createNewsListItem).join('');
}

/**
 * ニュース一覧ページにニュースを表示
 * @param {string} containerId - コンテナ要素のID
 */
async function renderNewsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const news = await getNews();

  if (news.length === 0) {
    container.innerHTML = '<p class="text-[#4c6a51] p-4 text-center">お知らせはありません。</p>';
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-grid">
      ${news.map(createNewsCard).join('')}
    </div>
  `;
}

/**
 * カテゴリでフィルタリング
 * @param {string} category - カテゴリ名（'all'で全表示）
 */
function filterByCategory(category) {
  const cards = document.querySelectorAll('#news-grid > a');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  // フィルターボタンのアクティブ状態を更新
  document.querySelectorAll('[data-filter]').forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-primary', 'text-white');
      btn.classList.remove('bg-white', 'dark:bg-[#1a2e1e]');
    } else {
      btn.classList.remove('bg-primary', 'text-white');
      btn.classList.add('bg-white', 'dark:bg-[#1a2e1e]');
    }
  });
}

/**
 * ニュース詳細ページを表示
 * @param {string} containerId - コンテナ要素のID
 */
async function renderNewsDetail(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // URLパラメータから記事IDを取得
  const params = new URLSearchParams(window.location.search);
  const newsId = params.get('id');

  if (!newsId) {
    container.innerHTML = '<p class="text-center text-[#4c6a51]">記事が見つかりません。</p>';
    return;
  }

  const news = await getNews();
  const article = news.find(n => n.id === newsId);

  if (!article) {
    container.innerHTML = '<p class="text-center text-[#4c6a51]">記事が見つかりません。</p>';
    return;
  }

  // Markdown を HTML に変換
  const contentHtml = typeof marked !== 'undefined'
    ? marked.parse(article.content)
    : article.content.replace(/\n/g, '<br>');

  container.innerHTML = `
    <article class="max-w-[800px] mx-auto">
      <div class="mb-8">
        <a href="news.html" class="text-primary hover:underline flex items-center gap-1 mb-6">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          ニュース一覧に戻る
        </a>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[#4c6a51]">${formatDate(article.date)}</span>
          ${createCategoryBadge(article.category)}
        </div>
        <h1 class="text-3xl md:text-4xl font-black mb-4">${article.title}</h1>
      </div>
      <div class="prose prose-lg dark:prose-invert max-w-none">
        ${contentHtml}
      </div>
      ${article.externalLink ? `
        <div class="mt-8 pt-8 border-t border-[#e7f3ea] dark:border-[#1a2e1e]">
          <a href="${article.externalLink}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-primary hover:underline">
            <span>詳細を見る（外部サイト）</span>
            <span class="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      ` : ''}

      <!-- SNS シェアボタン -->
      <div class="mt-10 pt-8 border-t border-[#e7f3ea] dark:border-[#1a2e1e]">
        <p class="text-sm font-bold text-[#4c6a51] dark:text-gray-400 mb-4">この記事をシェア</p>
        <div class="flex gap-3">
          <a id="share-twitter" href="#" target="_blank" rel="noopener"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:opacity-80 transition-opacity">
            <svg class="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
            ポスト
          </a>
          <a id="share-facebook" href="#" target="_blank" rel="noopener"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-full text-sm font-bold hover:opacity-80 transition-opacity">
            <svg class="size-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
            シェア
          </a>
        </div>
      </div>
    </article>
  `;

  // ページタイトル・OGPメタタグを更新
  const pageTitle = `${article.title} | CoderDojo 西条`;
  document.title = pageTitle;

  const pageUrl = window.location.href;
  const ogpImage = new URL('images/ogp.png', window.location.origin + window.location.pathname.replace(/[^/]*$/, '')).href;

  // OGPメタタグを更新
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', article.summary);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogpImage);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageTitle);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', article.summary);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogpImage);
  document.querySelector('meta[name="description"]')?.setAttribute('content', article.summary);

  // シェアボタンのURLを設定
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(pageUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  document.getElementById('share-twitter').href = twitterUrl;
  document.getElementById('share-facebook').href = facebookUrl;
}
