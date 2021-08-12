import core from '@actions/core';
import { Client } from '@notionhq/client';

// envs for develop
import { config } from 'dotenv';
config();
import dotenvJSON from 'dotenv-json';
dotenvJSON();

import dayjs from 'dayjs';
import 'dayjs/locale/ja.js'
dayjs.locale('ja');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_TOKEN});

const main = () => {
  const body = process.env.pull_request_body // process.env.GITHUB_EVENT_PATH.pull_request_body;
  console.log(body);
  const { title, date, tags } = getPropertiesFromBody(body);
  // getArticles();
  addArticle();
}

const getArticles = async () => {
  try {
    const resp = await notion.databases.query({
      database_id: DATABASE_ID,
    });
  } catch (e) {
    console.error(e);
  }
}

const addArticle = async (title, date, tags) => {
  try {
    const resp = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Date: {
          type: "date",
          date: {
            start: date,
            end: null,
          }
        },
        Tags: {
          type: "multi_select",
          multi_select: [ ...tags ]
        }
      },
    })
    console.log(resp);
  } catch (e) {
    console.error(e);
  }
}

const getPropertiesFromBody = (body) => {
  const title = ""
  const date = ""
  const tags = []
  return {
    title,
    date,
    tags
  }
}

const getPullRequestBody = () => {
  const eventPayload = require(process.env.GITHUB_EVENT_PATH)
}

main();