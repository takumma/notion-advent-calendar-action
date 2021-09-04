# notion-advent-calendar-action

日本語 | [English](./README_EN.md)

このアクションは、Githubで管理されている記事をNotionを使ったアドベントカレンダーに記録するものです。[merge-schedule-action](https://github.com/gr2m/merge-schedule-action)と組み合わせることで、
- 記事の予約投稿
- Notionのアドベントカレンダーへの自動追加

を行うことができます。想定している利用方法は、下の「Usage(with merge-schedule-action)」に記載しています。

## Usage
以下を行ってください。（参考：[Notion APi Getting started](https://developers.notion.com/docs/getting-started)）
- Notion APIのintegrationとアドベントカレンダー用のページを作成
- 作成したページに、integrationを追加
- GithubのリポジトリのSecretsにintegrationの「internal Integration Token」とページのDatabase IDをそれぞれ「NOTION_TOKEN」と「NOTION_DATABASE_ID」に設定

ワークフローを作成します。
```yml
name: Notion Advent Calender
on:
  pull_request:
    branches:
      - main
    # Pull RequestがMergeされたときに実行されるように設定
    types: [closed]

job:
  notion-advent-calender:
    runs-on: ubuntu-latest
    # Pull RequestがMergeされたときに実行されるように設定
    if: github.event.pull_request.merged == true
    steps:
      - uses: takumma/notion-advent-calender-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ NOTION_DATABASE_ID }}
```

PullRequestのdescriptionに、以下のような文章を追加します。
```
/title 記事のタイトル
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
```

### 各項目の説明

| プロパティ | 説明 |
----|----
| `/title` | 記事のタイトル |
| `/tags` | 記事のタグ。空白区切りで指定する |
| `/url` | 記事のURL |
| `/date` | アドベントカレンダーの日付を指定します。形式は[ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601)です。日付だけでも、時間を含めても大丈夫です。 |


## Usage (with merge-schedule-action)

### Notionの設定
Notion APIの[Getting started](https://developers.notion.com/docs/getting-started)のStep1, 2を参考にして、以下を行って下さい。
- Notion APIのintegrationの作成
- アドベントカレンダーのページを作成
- 「Share」から「Share to web」をONに
- 作成したintegrationを選択してinviteをする
- integrationのSecretsとページのDatabase IDをコピーしておく。

### GIthub App の作成
[merge-schedule-action](https://github.com/marketplace/actions/merge-schedule) をトリガーにして notion-advent-calendar のワークフローを実行するために、Github Appを作成する必要があります。

1. Githubの右上からSettingを開く
2. Developer settings -> Github Apps -> New Github App から、Github App を作成します。
3. 名前やHomePageなどは適当に設定してください。WebHookは使わないと思うのでActiveのチェックは外して大丈夫です。
4. Permissionsは、とりあえず actions, checks, contents, deployments, issues, pull requests, repository projects, Commit statuses あたりを設定します（ここら辺不要なPermissionを見つけれてないのでそのうち更新します...）
5. **Where can this GitHub App be installed?** は、**Only on this account** を選択しておきます。
6. Create Github App で作成したら、APP_ID と Private Key をメモしておきます。

Github App を作成したら、記事を管理してるリポジトリにインストールしておきましょう。

### merge-schedule-actionのワークフローを作成
[merge-schedule-action](https://github.com/marketplace/actions/merge-schedule) を使って、予約マージをするためのワークフローを作成します。

##### ワークフローのサンプル
```
name: Merge Schedule
on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize
  schedule:
    - cron: 0 0,6,12,18 * * *

jobs:
  merge_schedule:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Token
        id: generate_token
        uses: tibdex/github-app-token@v1
        with:
          app_id: ${{ secrets.APP_ID }}
          private_key: ${{ secrets.PRIVATE_KEY }}
      - name: Merge Schedule
        uses: gr2m/merge-schedule-action@v1
        with:
          time_zone: "Asia/Tokyo"
        env:
          GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
```

Secrets の APP_ID と PRIVATE_KEY にはそれぞれ先ほど作成した Github App の APP_ID と Private key を設定します。

### notion-advent-calender-actionのワークフローを作成
記事を管理しているリポジトリで、Setting -> Secrets -> New repository secretから、
コピーしておいたintegrationのSecretsとページのDatabase IDをそれぞれ「NOTION_TOKEN」と「NOTION_DATABASE_ID」に設定してください。

ワークフローを作成します。
```yml
name: Notion Advent Calendar
on:
  pull_request:
    branches:
      - main
    # Pull RequestがMergeされたときに実行されるように設定
    types: [closed]

job:
  notion-advent-calender:
    runs-on: ubuntu-latest
    # Pull RequestがMergeされたときに実行されるように設定
    if: github.event.pull_request.merged == true
    steps:
      - uses: takumma/notion-advent-calender-action@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ NOTION_DATABASE_ID }}
```

### Pull Requestを作成
記事を書いて、Pull Requestを作成します。Pull Requestのdescriptionには、以下の行を含めます。（`/schedule`がmerge-schedule-actionのプロパティです。）
```
/title 記事のタイトル
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
/schedule 2021-8-18-12:00
```
