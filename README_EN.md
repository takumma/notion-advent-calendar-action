# notion-advent-calendar-action

[日本語](./README.md) | English

This action records the articles managed by Github into an advent calendar using Notion. By combining it with [merge-schedule-action](https://github.com/gr2m/merge-schedule-action), you can
- Scheduled submission of articles
- Automatically add articles to Notion's advent calendar

to Notion's advent calendar. The expected usage is described in "Usage(with merge-schedule-action)" below.

## Usage
Please do the following. (Reference: [Notion APi Getting started](https://developers.notion.com/docs/getting-started))
- Create a page for Notion API's integration and advent calendar.
- Add the integration to the page you created.
- Set the "internal Integration Token" of the integration and the Database ID of the page to "NOTION_TOKEN" and "NOTION_DATABASE_ID" respectively in the Github repository Secrets.

Create a workflow.
```yml
name: Notion Advent Calender
on:
  pull_request:
    branches:
      - main
    # Set this to run when the pull request is merged
    types: [closed].

job:
  notion-advent-calender:
    runs-on: ubuntu-latest
    # Set it to run when a Pull Request is merged.
    if: github.event.pull_request.merged == true
    steps:
      - uses: takumma/notion-advent-calender-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ NOTION_DATABASE_ID }}
````

Add the following text to the description of the PullRequest.
```
/title Title of the article
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
```

### Description of each item

| property | description |
----|----
| `/title` | title of the article.
| `/tags` | Tags of the article. Separated by spaces.
| `/url` | URL of the article.
| `/date` | the date of the advent calendar. The format is [ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601). You can use just the date or include the time. |The format is [ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601).


## Usage (with merge-schedule-action)

### Notion Settings
Refer to Step 1 and Step 2 of [Getting started](https://developers.notion.com/docs/getting-started) of Notion API, and do the following.
- Create Notion API's integration.
- Create an advent calendar page.
- Go to "Share" and set "Share to web" to ON.
- Select the integration you have created and invite it.
- Copy the Secrets of the integration and the Database ID of the page.

### Create GIthub App
In order to run the notion-advent-calendar workflow triggered by [merge-schedule-action](https://github.com/marketplace/actions/merge-schedule), we need to create a Github App. 1.

1. open Setting from the top right corner of Github. 2.
2. create a Github App from Developer settings -> Github Apps -> New Github App. 3.
Set the name, HomePage, etc. as you see fit, and since you probably won't be using WebHook, you can leave Active unchecked. 4.
For Permissions, set actions, checks, contents, deployments, issues, pull requests, repository projects, and commit statuses. I haven't found any Permissions yet, so I'll update that soon...) 5.
For **Where can this GitHub App be installed?**, select **Only on this account**. 6.
Once you have created the Github App, make a note of the APP_ID and Private Key.

After creating the Github App, install it in the repository where you are managing the articles.

### Create a workflow for merge-schedule-action.
Create a workflow to do a scheduled merge using [merge-schedule-action](https://github.com/marketplace/actions/merge-schedule).

##### Sample Workflow
````
name: Merge Schedule
on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize
  schedule:
    - cron: 0 0,6,12,18 * * * *

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
````

Set the APP_ID and PRIVATE_KEY of Secrets to the APP_ID and Private key of the Github App you just created, respectively.

### Create a workflow for notion-advent-calender-action.
In the repository where you are managing the article, go to Setting -> Secrets -> New repository secret and enter
Set the "NOTION_TOKEN" and "NOTION_DATABASE_ID" to the copied integration secrets and the Database ID of the page, respectively.

Create the workflow.
```yml
name: Notion Advent Calendar
on:
  pull_request:
    branches:
      - main
    # Set this to run when the pull request is merged
    types: [closed].

job:
  notion-advent-calender:
    runs-on: ubuntu-latest
    # Set it to run when a Pull Request is merged.
    if: github.event.pull_request.merged == true
    steps:
      - uses: takumma/notion-advent-calender-action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ NOTION_DATABASE_ID }}
```

### Create a Pull Request
Write an article and create a pull request. include the following line in the description of the pull request. Include the following line in the description of the pull request (where `/schedule` is a property of merge-schedule-action).
(where `/schedule` is a property of merge-schedule-action)

```
/title Title of the article
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
/schedule 2021-8-18-12:00
```

A pull request template is also available if you want to use it.
[pull_request_template.md](. /.github/pull_request_template.md)
