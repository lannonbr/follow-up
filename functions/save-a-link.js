// Name: save-a-link
// Shortcut: opt+l
// Description: Save a link for later use

/** @type {import("@johnlindquist/kit")} */

const { DynamoDBClient } = await npm("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = await npm(
  "@aws-sdk/lib-dynamodb"
);
const dayjs = await npm("dayjs");

const tab = await getActiveTab("Microsoft Edge");

const data = await fields([
  { label: "name", placeholder: "Link Name" },
  {
    label: "link",
    value: tab,
  },
  "comments",
]);

const key = await env("FOLLOW_UP_AWS_ACCESS_KEY_ID");
const secret = await env("FOLLOW_UP_AWS_SECRET_ACCESS_KEY");
const TableName = await env("FOLLOW_UP_TABLE_NAME");

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: key,
    secretAccessKey: secret,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const currentTime = dayjs();

const yearMonth = currentTime.format("YYYY-MM");
const timestamp = currentTime.unix().toString();

await docClient.send(
  new PutCommand({
    TableName,
    Item: {
      year_month: yearMonth,
      timestamp,
      name: data[0],
      url: data[1],
      comments: data[2],
    },
  })
);
