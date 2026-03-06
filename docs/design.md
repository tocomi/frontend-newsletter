# Frontend Newsletter Agent 設計書

## 概要

This Week in React と JavaScript Weekly の最新号を自動取得し、関連記事をピックアップ・要約して Slack に投稿する Mastra エージェント。

---

## アーキテクチャ

```
[RSS フィード取得]
       ↓
[ニュースレター解析・記事リスト抽出]
       ↓
[記事フィルタリング（除外ルール適用）]
       ↓
[各記事の本文取得（URL スクレイピング）]
       ↓
[記事の要約・おすすめ度判定（Claude）]
       ↓
[Slack 投稿（親メッセージ + スレッド）]
```

---

## ディレクトリ構成

```
src/mastra/
├── agents/
│   └── newsletter-agent.ts             # メインエージェント
├── tools/
│   ├── fetch-newsletter.ts             # ニュースレター取得ツール
│   ├── fetch-article.ts                # 記事本文取得ツール
│   └── post-slack.ts                   # Slack 投稿ツール
├── workflows/
│   ├── this-week-in-react-workflow.ts  # This Week in React ワークフロー
│   └── javascript-weekly-workflow.ts   # JavaScript Weekly ワークフロー
└── index.ts
```

---

## ニュースレター

| 名前 | URL |
|------|-----|
| This Week in React | https://thisweekinreact.com/newsletter |
| JavaScript Weekly | https://javascriptweekly.com/issues/latest |

最新号の取得は各サイトの RSS フィードを利用する。

---

## ピックアップ基準

### 含めるトピック

- React / TypeScript
- Vite / Rolldown / OXC / Biome などフロントエンドエコシステム周辺ツール
- ブラウザ拡張機能開発
- ブラウザ自体の新機能（Chrome / Firefox / Safari など）
- Web 周辺の話題全般

### 除外するトピック

- スポンサー広告・プロモーション記事
- React Native 固有の話題
- Vue.js / Angular 関連
- モバイルアプリ固有の話題（Expo, Capacitor など）
- 同一トピックの重複記事（代表1つに絞る）

---

## 調査方針

1. ニュースレター内のリンクをすべて展開し、公式ソース（公式ブログ・GitHub・X など）まで内容を調査する
2. 関連資料も参照して内容を補完する
3. 同一トピックが複数 URL にまたがる場合は代表記事を1つ選んでまとめる

---

## 出力フォーマット

記事1件あたりのフォーマット（日本語）：

```markdown
# タイトル（原文タイトルを簡潔に日本語化）

おすすめ度: ⭐⭐⭐⭐☆

## 評価軸
- 影響度：（このニュースがエコシステム・プロジェクトに与えるインパクト）
- 実装価値：（実際のコードに活かせる度合い）
- 新規性：（新しいアイデア・技術かどうか）
- 学習価値：（読んで得られる知識・理解の深さ）

## 要約
1. 何が発表/更新されたか
2. 重要なポイント
3. 対象読者/影響範囲
4. 補足/背景
5. 今後の展望

## リンク
元記事：https://...
関連：https://...
```

### おすすめ度の基準

| 度 | 基準 |
|----|------|
| ⭐⭐⭐⭐⭐ | 今すぐ確認すべき重大な変更・リリース |
| ⭐⭐⭐⭐☆ | 実装・設計に直結する有益な情報 |
| ⭐⭐⭐☆☆ | 知識として持っておく価値がある |
| ⭐⭐☆☆☆ | 参考程度・関心があれば読む |
| ⭐☆☆☆☆ | ほぼ除外対象だが一応含めた記事 |

---

## Slack 投稿仕様

### 親メッセージ（スレッド起点）

- 内容：週次まとめの見出し + 件数
- トーン：ユーモア・温かみのある文体
- 例：`🗞️ 今週もフロントエンド界隈が騒がしかったよ！厳選 N 件をお届けします 🚀`

### スレッドメッセージ

- 記事1件につき1メッセージ
- フォーマットは上記「出力フォーマット」に従う
- スタンプで反応しやすいよう1件ずつ分割して投稿する

---

## ツール定義

### `fetch-newsletter`

ニュースレターの最新号を RSS フィードから取得し、記事リストを返す。

**入力**
```ts
{
  source: 'this-week-in-react' | 'javascript-weekly'
}
```

**出力**
```ts
{
  title: string       // ニュースレターのタイトル
  issueUrl: string    // 今号の URL
  articles: Array<{
    title: string
    url: string
    description?: string
  }>
}
```

### `fetch-article`

記事の URL にアクセスして本文を取得する。

**入力**
```ts
{
  url: string
}
```

**出力**
```ts
{
  title: string
  content: string    // 本文テキスト
  url: string
}
```

### `post-slack`

Slack にメッセージを投稿する。スレッド投稿にも対応。

**入力**
```ts
{
  channel: string
  text: string
  threadTs?: string  // 指定するとスレッド返信になる
}
```

**出力**
```ts
{
  ts: string         // 投稿したメッセージのタイムスタンプ（スレッド起点に使う）
}
```

---

## ワークフロー

2つのニュースレターはそれぞれ独立したワークフローとして実装する。

### this-week-in-react-workflow

```
Step 1: fetch-newsletter（This Week in React）
Step 2: 記事リストのフィルタリング
Step 3: fetch-article × N（各記事の本文取得）
Step 4: OpenAI による要約・おすすめ度判定
Step 5: post-slack（親メッセージ投稿）
Step 6: post-slack × N（各記事をスレッドに投稿）
```

### javascript-weekly-workflow

```
Step 1: fetch-newsletter（JavaScript Weekly）
Step 2: 記事リストのフィルタリング
Step 3: fetch-article × N（各記事の本文取得）
Step 4: OpenAI による要約・おすすめ度判定
Step 5: post-slack（親メッセージ投稿）
Step 6: post-slack × N（各記事をスレッドに投稿）
```

---

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `SLACK_BOT_TOKEN` | Slack Bot Token（`xoxb-...`） |
| `SLACK_CHANNEL_ID` | 投稿先チャンネルの ID |
| `OPENAI_API_KEY` | OpenAI API キー |

---

## 実装フェーズ

### フェーズ 1：手動実行

`pnpm run dev` で Mastra の開発サーバーを起動し、エージェントを手動でキックする。

### フェーズ 2：自動実行

RSS フィードの更新を検知して自動実行する。
Mastra のスケジュール機能または外部 Cron（GitHub Actions など）を利用する。
