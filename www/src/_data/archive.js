const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const archiveFolder = path.resolve(__dirname, "../archive");

const archives = fs
  .readdirSync(archiveFolder)
  .filter((name) => path.extname(name) === ".json")
  .map((name) => ({
    key: path.parse(name).name,
    data: require(path.join(archiveFolder, name))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((item) => {
        return {
          ...item,
          timestamp: dayjs.unix(item.timestamp).format("MM/DD/YYYY"),
          timestampISO: dayjs.unix(item.timestamp).toISOString(),
        };
      }),
  }));

module.exports = archives;
