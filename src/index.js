const core = require('@actions/core');
require('dotenv').config();
const { Client } = require('@notionhq/client');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const main = () => {
  console.log(DATABASE_ID);
  console.log(NOTION_API_KEY);
}

const getPullRequestBody = () => {
  const eventPayload = require(process.env.GITHUB_EVENT_PATH)
}

main();
