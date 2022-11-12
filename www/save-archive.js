require("dotenv").config();
const dayjs = require("dayjs");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbClient = new DynamoDBClient({
  region: "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM");

async function getLastMonthArcive() {
  let result = await docClient.send(
    new QueryCommand({
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression: "year_month = :ym",
      ExpressionAttributeNames: {
        "#n": "name",
        "#t": "timestamp",
        "#u": "url",
      },
      ExpressionAttributeValues: {
        ":ym": lastMonth,
      },
      ProjectionExpression: "#n, #t, #u, comments",
    })
  );

  const items = [];

  items.push(...result.Items);

  while (result.LastEvaluatedKey !== undefined) {
    result = await docClient.send(
      new QueryCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        KeyConditionExpression: "year_month = :ym",
        ExclusiveStartKey: result.LastEvaluatedKey,
        ExpressionAttributeNames: {
          "#n": "name",
          "#t": "timestamp",
          "#u": "url",
        },
        ExpressionAttributeValues: {
          ":ym": lastMonth,
        },
        ProjectionExpression: "#n, #t, #u, comments",
      })
    );

    items.push(...result.Items);
  }

  console.log(JSON.stringify(items));
}

getLastMonthArcive();
