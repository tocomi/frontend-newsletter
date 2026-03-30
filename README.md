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

### 3. エージェントの実行

各ニュースレターのスクリプトを実行する。

```bash
# JavaScript Weekly
pnpm run:js-weekly

# This Week in React
pnpm run:react
```

投稿が成功すると、設定した Slack チャンネルに親メッセージと各記事のスレッドが届く。

## CI / GitHub Actions

### スケジュール実行

| ワークフロー | スケジュール | cron |
|---|---|---|
| JavaScript Weekly | 毎週水曜 09:00 JST | `0 0 * * 3`（水曜 00:00 UTC） |
| This Week in React | 毎週木曜 09:00 JST | `0 0 * * 4`（木曜 00:00 UTC） |

`workflow_dispatch` が設定されているため、GitHub Actions の画面から手動実行も可能。

### GitHub Secrets の設定

リポジトリの **Settings > Secrets and variables > Actions** に以下を登録する。

| Secret 名 | 説明 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API キー |
| `SLACK_BOT_TOKEN` | Slack Bot Token（`xoxb-...`） |
| `SLACK_CHANNEL_ID` | 投稿先 Slack チャンネルの ID |

### 手動実行

1. GitHub リポジトリの **Actions** タブを開く
2. 実行したいワークフロー（`JavaScript Weekly Newsletter` または `This Week in React Newsletter`）を選択
3. **Run workflow** をクリック

## プロジェクト構成

```
src/mastra/
├── agents/         # エージェント定義
├── tools/          # ツール定義（ニュースレター取得・記事取得・Slack 投稿）
├── workflows/      # ワークフロー定義
└── index.ts        # Mastra エントリポイント
```

詳細な設計は [docs/design.md](./docs/design.md) を参照。
