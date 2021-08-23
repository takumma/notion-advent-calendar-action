const { Client } = require("@notionhq/client")

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_TOKEN});

const main = () => {
  const eventPayload = require(process.env.GITHUB_EVENT_PATH);
  const body = eventPayload.pull_request.body;
  const properties = getPropertiesFromBody(body);
  addArticle(properties);
}

const getPropertiesFromBody = (body) => {
  const propertyTexts = body.split('\r\n');
  const result = {}
  for(let propertyText of propertyTexts) {
    const [name, ...props] = propertyText.split(' ');
    switch (name) {
      case '/title':
        result["title"] = {
          title: [
            {
              text: {
                content: props.join(' '),
              },
            },
          ],
        };
        break;
      case '/tags':
        result["Tags"] = {
          type: "multi_select",
          multi_select: props.map((tag) => {
            return {
              name: tag
            };
          })
        };
        break;
      case '/url':
        result["URL"] = {
          type: "url",
          url: props.join(),
        };
        break;
      case '/date':
        result["Date"] = {
          type: "date",
          date: {
            start: props.join(),
            end: null,
          }
        };
    }
  }
  return result
}

const addArticle = async (properties) => {
  try {
    const resp = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: { ...properties },
    })
    console.log(resp);
  } catch (e) {
    console.error(e);
  }
}

main();
