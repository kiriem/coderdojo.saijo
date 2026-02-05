/**
 * CoderDojo 西条 - イベント表示モジュール
 */

/**
 * 日付をフォーマットする
 * @param {Object} event - イベントオブジェクト
 * @returns {string} フォーマット済み日付
 */
function formatEventDate(event) {
  const date = new Date(event.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日 (${event.dayOfWeek}) ${event.startTime}〜${event.endTime}`;
}

/**
 * 次回開催情報のカードを生成
 * @param {Object} event - イベントオブジェクト
 * @returns {string} HTML 文字列
 */
function createNextEventCard(event) {
  const status = CONFIG.eventStatus[event.status] || CONFIG.eventStatus.open;
  const isClickable = event.status === 'open';

  const buttonHtml = isClickable
    ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener" class="w-full py-3 ${status.buttonClass} font-bold rounded-full text-sm hover:opacity-90 transition-opacity block text-center">${status.buttonText}</a>`
    : `<button disabled class="w-full py-3 ${status.buttonClass} font-bold rounded-full text-sm">${status.buttonText}</button>`;

  return `
    <div class="bg-white dark:bg-[#1a2e1e] p-6 rounded-xl shadow-xl border border-primary/20">
      <div class="flex items-center gap-3 mb-4 text-primary">
        <span class="material-symbols-outlined">event</span>
        <span class="text-xs font-bold tracking-widest uppercase">Next Event</span>
        ${event.status !== 'open' ? `<span class="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">${status.label}</span>` : ''}
      </div>
      <h3 class="text-xl font-bold mb-1">第${event.number}回 CoderDojo 西条</h3>
      <p class="text-sm text-[#4c6a51] dark:text-gray-400 mb-4">${formatEventDate(event)}</p>
      ${buttonHtml}
    </div>
  `;
}

/**
 * ヒーローセクションの次回開催カードを表示
 * @param {string} containerId - コンテナ要素のID
 */
async function renderNextEvent(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const data = await loadEvents();

  if (!data.nextEvent) {
    container.innerHTML = `
      <div class="bg-white dark:bg-[#1a2e1e] p-6 rounded-xl shadow-xl border border-primary/20">
        <div class="flex items-center gap-3 mb-4 text-primary">
          <span class="material-symbols-outlined">event</span>
          <span class="text-xs font-bold tracking-widest uppercase">Next Event</span>
        </div>
        <p class="text-sm text-[#4c6a51] dark:text-gray-400">次回の開催日は未定です。</p>
      </div>
    `;
    return;
  }

  container.innerHTML = createNextEventCard(data.nextEvent);
}

/**
 * ヒーローセクションのボタンリンクを更新
 */
async function updateHeroButtons() {
  const data = await loadEvents();

  if (data.nextEvent && data.nextEvent.status === 'open') {
    // 「次回の開催日を確認」ボタンにリンクを設定
    const checkButton = document.querySelector('[data-action="check-next-event"]');
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        document.getElementById('next-event-container')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}
