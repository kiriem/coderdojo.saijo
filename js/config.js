/**
 * CoderDojo 西条 - 設定ファイル
 */

const CONFIG = {
  // データファイルのパス
  paths: {
    news: 'data/news.yml',
    events: 'data/events.yml',
    header: 'components/header.html',
    footer: 'components/footer.html'
  },

  // カテゴリ定義
  categories: {
    notice: {
      label: 'Notice',
      labelJa: 'お知らせ',
      bgColor: 'bg-primary/20',
      textColor: 'text-primary',
      borderColor: 'border-primary/30'
    },
    report: {
      label: 'Report',
      labelJa: 'レポート',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-500',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    event: {
      label: 'Event',
      labelJa: 'イベント',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-500',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  },

  // イベントステータス定義
  eventStatus: {
    open: {
      label: '受付中',
      buttonText: '申し込む',
      buttonClass: 'bg-primary text-white'
    },
    closed: {
      label: '受付終了',
      buttonText: '受付終了',
      buttonClass: 'bg-gray-400 text-white cursor-not-allowed'
    },
    cancelled: {
      label: '中止',
      buttonText: '中止になりました',
      buttonClass: 'bg-red-400 text-white cursor-not-allowed'
    }
  },

  // トップページに表示するニュース件数
  newsPreviewCount: 3
};
