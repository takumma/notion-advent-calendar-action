const core = require('@actions/core');
require('dotenv').config();
const { Client } = require('@notionhq/client');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_API_KEY});

const main = () => {
  console.log(DATABASE_ID);
  console.log(NOTION_API_KEY);
  getArticles();
  addArticle();
}

const getArticles = async () => {
  try {
    const resp = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    console.log(resp.results[1].properties.Date.date);
  } catch (e) {
    console.error(e);
  }
}

const addArticle = async () => {
  try {
    const resp = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: "sample",
              },
            },
          ],
          // date: {
          //   start: Date.now().toString(),
          //   end: null,
          // }
        },
      },
    })
    console.log(resp);
  } catch (e) {
    console.error(e);
  }
}

const getPullRequestBody = () => {
  const eventPayload = require(process.env.GITHUB_EVENT_PATH)
}

main();
