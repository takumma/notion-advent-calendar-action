# notion-advent-calendar-action

[日本語](./README.md) | English

This action records the articles managed by Github in an advent calendar using Notion. By combining it with [merge-schedule-action](https://github.com/gr2m/merge-schedule-action), you can
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
```

In your Pull Request's description, add lines
```
/title Title of the article
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
```

### Description of each item

| property | description |
----|----
| `/title` | title of the article.|
| `/tags` | Tags of the article. Separated by spaces.|
| `/url` | URL of the article.|
| `/date` | the date of the advent calendar. The format is [ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601). You can use just the date or include the time. |


## Usage (with merge-schedule-action)

### Notion Settings
Refer to Step 1 and Step 2 of [Getting started](https://developers.notion.com/docs/getting-started) of Notion API, and do the following.
- Create Notion API's integration.
- Create an advent calendar page.
- Go to "Share" and set "Share to web" to ON.
- Select the integration you have created and invite it.
- Copy the integration's Secrets and the page's Database ID.

### Create a workflow for merge-schedule-action.
Refer to Usage in [merge-schedule-action](https://github.com/marketplace/actions/merge-schedule) and create a workflow in the repository where you are managing the article.

### Create a workflow for notion-advent-calender-action.
In the repository where you are managing the articles, go to Setting -> Secrets -> New repository secret.
Set the "NOTION_TOKEN" and "NOTION_DATABASE_ID" to the copied integration secrets and the Database ID of the page, respectively.

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
```

### Create a Pull Request
Write an article and create a pull request. include the following line in the description of the pull request. Include the following lines in the description of the pull request (where `/schedule` is a property of merge-schedule-action).
```
/title Title of the article
/tags Notion Javascript
/url http://example.com
/date 2021-8-18
/schedule 2021-8-18
```