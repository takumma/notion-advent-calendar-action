import core from '@actions/core';
import { Client } from '@notionhq/client';

// envs for develop
import { config } from 'dotenv';
config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_TOKEN});

const main = () => {
  const body = process.env.GITHUB_EVENT_PATH.pull_request.body; // process.env.pull_request_body
  const { title, tags, url, date } = getPropertiesFromBody(body);
  addArticle({title: title, tags: tags, url: url, date: date});
}

const getPropertiesFromBody = (body) => {
  const result = {
    title: "",
    tags: [],
    url: "",
    date: "",
  }
  const propertyTexts = body.split('\\r\n');
  for(let propertyText of propertyTexts) {
    const [name, ...props] = propertyText.split(' ');
    switch (name) {
      case '/title':
        result.title = props.join(' ');
        break;
      case '/tags':
        result.tags = props;
        break;
      case '/url':
        result.url = props.join();
        break;
      case '/date':
        result.date = props.join();
    }
  }
  return result
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

const addArticle = async ({
  title,
  tags,
  url,
  date
}) => {
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
          multi_select: tags.map((tag) => {
            return {
              name: tag
            };
          })
        },
        URL: {
          type: "url",
          url: url,
        }
      },
    })
    console.log(resp);
  } catch (e) {
    console.error(e);
  }
}

main();