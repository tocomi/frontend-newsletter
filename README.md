# frontend-newsletter

JavaScript Weekly と This Week in React の最新号を自動取得し、関連記事をピックアップ・要約して Slack に投稿する AI エージェント。

[Mastra](https://mastra.ai) フレームワークと OpenAI を使って実装されており、各ニュースレターごとに専用のエージェントを持つ。

## 機能

- RSS フィードからニュースレターの最新号を取得
- 関連記事のフィルタリング（スポンサー・除外トピックを除去）
- 各記事の本文をスクレイピングして取得
- OpenAI による日本語要約とおすすめ度（★ 5段階）の判定
- Slack への投稿（親メッセージ + 記事ごとのスレッド）

## 対応ニュースレター

| ニュースレター | エージェント |
|---|---|
| [JavaScript Weekly](https://javascriptweekly.com) | `javascript-weekly-agent` |
| [This Week in React](https://thisweekinreact.com) | `this-week-in-react-agent` |

## セットアップ

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env` ファイルをプロジェクトルートに作成し、以下の変数を設定する。

```env
OPENAI_API_KEY=<OpenAI API キー>
SLACK_BOT_TOKEN=<Slack Bot Token（xoxb-...）>
SLACK_CHANNEL_ID=<投稿先 Slack チャンネルの ID>
```

**Slack Bot の設定**

Slack App に以下の Bot Token Scope が必要:

- `chat:write` — メッセージ投稿

Bot を投稿先チャンネルに招待しておくこと。

### 3. 開発サーバーの起動

```bash
pnpm run dev
```

[http://localhost:4111](http://localhost:4111) で Mastra Studio が起動する。

### 4. エージェントの実行

Mastra Studio を開き、以下の手順で実行する。

1. サイドバーから対象のエージェント（例: `javascript-weekly-agent`）を選択
2. チャット入力欄に `Slack に投稿してください` と入力
3. エージェントが記事の取得・要約・Slack 投稿を順に実行する

投稿が成功すると、設定した Slack チャンネルに親メッセージと各記事のスレッドが届く。

## プロジェクト構成

```
src/mastra/
├── agents/         # エージェント定義
├── tools/          # ツール定義（ニュースレター取得・記事取得・Slack 投稿）
├── workflows/      # ワークフロー定義
└── index.ts        # Mastra エントリポイント
```

詳細な設計は [docs/design.md](./docs/design.md) を参照。
