const { resolve } = require('path');
const { readFile, writeFile } = require('fs');

async function main() {
  const jsonFilePath = process.argv[2];
  const outputFilePath = process.argv[3] || '.env';

  if (!jsonFilePath) {
    console.error(
      "Please provide a path to a json file to parse\n\nExample: deno json_to_dotenv.ts path/to/file.json"
    );
    return;
  }

  readFile(resolve(jsonFilePath), (err, jsonBuffer) => {
    if (err) {
      console.error(`Unable to read file: ${jsonFilePath}`);
      console.error(err);
      return;
    }

    let configObject = {};
    try {
      configObject = JSON.parse(jsonBuffer.toString());
    } catch (e) {
      console.error(`Unable to parse json from file: ${jsonFilePath}`);
      console.error(e);
      return;
    }

    const keyValuePairs = parseKeyValuePairs(configObject);
    const output = keyValuePairs.map(formatKeyValuePair).join("\n");

    writeFile(resolve(outputFilePath), output + "\n", (err) => {
      if (err) {
        console.error(`Unable to write file: ${outputFilePath}`);
        console.error(err);
        return;
      }
    });
  });
}

function parseKeyValuePairs(json, prefix) {
  const keyValuePairs = Object.keys(json).reduce((pairs, key) => {
    const value = json[key];

    const displayKey = (prefix ? `${prefix}_${key}` : key).toUpperCase();

    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      pairs.push([displayKey, `${value}`]);
    } else if (Array.isArray(value)) {
      pairs.push([displayKey, value.join(",")]);
    } else if (typeof value === "object") {
      pairs = pairs.concat(
        parseKeyValuePairs(value, displayKey)
      );
    }

    return pairs;
  }, []);

  return keyValuePairs;
}

function formatKeyValuePair(kayValuePair) {
  return `${kayValuePair[0]}=${kayValuePair[1]}`;
}

main();
