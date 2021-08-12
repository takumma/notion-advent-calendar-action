import core from '@actions/core';
import { Client } from '@notionhq/client';
import { config } from 'dotenv';
config();

import dayjs from 'dayjs';
import 'dayjs/locale/ja.js'
dayjs.locale('ja');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_TOKEN});

const main = () => {
  getArticles();
  addArticle();
}

const getArticles = async () => {
  try {
    const resp = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    console.log(resp.results[0].properties.Tags.multi_select);
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
                content: "sample3",
              },
            },
          ],
        },
        Date: {
          type: "date",
          date: {
            start: dayjs(),
            end: null,
          }
        },
        Tags: {
          type: "multi_select",
          multi_select: [
            {
              name: "Flutter",
            }
          ]
        }
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
