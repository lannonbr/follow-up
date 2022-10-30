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

module.exports = {
  eleventyComputed: {
    links: async () => {
      const lastSevenDays = dayjs().subtract(1, "week");
      const result = await docClient.send(
        new QueryCommand({
          TableName: process.env.DYNAMO_TABLE_NAME,
          KeyConditionExpression: "year_month = :ym and #t > :t",
          ExpressionAttributeNames: {
            "#n": "name",
            "#t": "timestamp",
            "#u": "url",
          },
          ExpressionAttributeValues: {
            ":ym": "2022-10",
            ":t": lastSevenDays.unix().toString(),
          },
          ProjectionExpression: "#n, #t, #u, comments",
        })
      );

      let { Items } = result;

      Items = Items.map((item) => {
        return {
          ...item,
          timestamp: dayjs.unix(item.timestamp).format("MM/DD/YYYY"),
          timestampISO: dayjs.unix(item.timestamp).toISOString(),
        };
      });

      return Items.reverse();
    },
  },
};
