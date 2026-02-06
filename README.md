# CoderDojo 西条 @広島大学 公式サイト

広島県東広島市で活動するCoderDojo西条の公式ウェブサイトです。

## サイト構成

```
coderdojo.saijo/
├── index.html          # トップページ
├── news.html           # ニュース一覧
├── news-detail.html    # ニュース詳細
├── privacy.html        # プライバシーポリシー
├── data/
│   ├── news.yml        # ニュースデータ
│   └── events.yml      # イベントデータ
├── js/                 # JavaScriptファイル
├── components/         # 共通コンポーネント
└── images/             # 画像ファイル
```

## 更新方法

### ニュースの追加・編集

`data/news.yml` を編集します。

#### 新しいニュースを追加する

ファイルの先頭（コメントの下）に以下の形式で追加：

```yaml
- id: "2026-02-10-notice-title"
  date: "2026-02-10"
  category: notice
  title: "ニュースのタイトル"
  summary: "一覧に表示される概要文"
  content: |
    # 見出し

    本文をMarkdown形式で記述します。

    ## 小見出し
    - リスト項目1
    - リスト項目2

    **太字** や [リンク](https://example.com) も使えます。
  externalLink: ""
```

#### フィールド説明

| フィールド | 説明 |
|-----------|------|
| `id` | 一意のID（日付-カテゴリ-キーワード推奨） |
| `date` | 日付（YYYY-MM-DD形式） |
| `category` | `notice`（お知らせ）/ `report`（レポート）/ `event`（イベント） |
| `title` | タイトル |
| `summary` | 一覧ページに表示される概要 |
| `content` | 詳細ページの本文（Markdown形式） |
| `externalLink` | 外部リンクがある場合はURLを記入（空欄で詳細ページへ） |

---

### 次回開催情報の更新

`data/events.yml` を編集します。

```yaml
nextEvent:
  number: 2
  date: "2026-03-15"
  dayOfWeek: "日"
  startTime: "10:00"
  endTime: "12:00"
  location: "広島大学東広島キャンパス 教育学部"
  registrationUrl: "https://coderdojo-saijo.connpass.com/"
  status: open
```

#### フィールド説明

| フィールド | 説明 |
|-----------|------|
| `number` | 開催回数 |
| `date` | 開催日（YYYY-MM-DD形式） |
| `dayOfWeek` | 曜日（日/月/火/水/木/金/土） |
| `startTime` | 開始時刻 |
| `endTime` | 終了時刻 |
| `location` | 開催場所 |
| `registrationUrl` | 申し込みページのURL |
| `status` | `open`（受付中）/ `closed`（受付終了）/ `cancelled`（中止） |

---

## ローカルでの確認方法

YAMLファイルを編集した後、ローカルで確認する場合：

```bash
cd coderdojo.saijo
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開いて確認できます。

## デプロイ

GitHub Pagesを使用しています。`main`ブランチにプッシュすると自動的に公開されます。

```bash
git add .
git commit -m "ニュースを追加"
git push origin main
```
