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

async function fetchItems(yearMonth, timestamp) {
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
        ":ym": yearMonth,
        ":t": timestamp,
      },
      ProjectionExpression: "#n, #t, #u, comments",
    })
  );

  return result.Items;
}

module.exports = {
  eleventyComputed: {
    links: async () => {
      const sevenDaysAgo = dayjs().subtract(1, "week");

      let items = [];

      // If 7 days ago was a different month, fetch the following month's partition as well
      if (sevenDaysAgo.month() !== dayjs().month()) {
        const yearMonth = sevenDaysAgo.add(1, "month").format("YYYY-MM");
        const timestamp = sevenDaysAgo.unix().toString();
        const newItems = await fetchItems(yearMonth, timestamp);

        items.push(...newItems);
      }

      const yearMonth = sevenDaysAgo.format("YYYY-MM");
      const timestamp = sevenDaysAgo.unix().toString();
      const newItems = await fetchItems(yearMonth, timestamp);

      items.push(...newItems);

      return items
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((item) => {
          return {
            ...item,
            timestamp: dayjs.unix(item.timestamp).format("MM/DD/YYYY"),
            timestampISO: dayjs.unix(item.timestamp).toISOString(),
          };
        });
    },
  },
};
