import { resolve } from "https://deno.land/std@v0.5/fs/path.ts";
import { readFileStr, writeFileStr } from "https://deno.land/std/fs/mod.ts";

type JSONValue = null | string | number | boolean | IJSONObject;

interface IJSONObject {
  [key: string]: JSONValue | JSONValue[] | IJSONObject | IJSONObject[];
}

async function main() {
  if (!Deno.args[1]) {
    console.error(
      "Please provide a path to a json file to parse\n\nExample: deno json_to_dotenv.ts path/to/file.json"
    );
    return;
  }

  let jsonString = "";
  try {
    jsonString = await readFileStr(resolve(Deno.args[1]));
  } catch (e) {
    console.error(`Unable to read file: ${Deno.args[1]}`);
    return;
  }

  let configObject: IJSONObject = {};
  try {
    configObject = JSON.parse(jsonString);
  } catch (e) {
    console.error(`Unable to parse json from file: ${Deno.args[1]}`, e);
  }

  const keyValuePairs = parseKeyValuePairs(configObject);
  const output = keyValuePairs.map(formatKeyValuePair).join("\n");

  await writeFileStr(Deno.args[2] || ".env", output + "\n");
}

function parseKeyValuePairs(json: IJSONObject, prefix?: string) {
  const keyValuePairs = Object.keys(json).reduce<[string, string][]>((pairs, key) => {
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

function formatKeyValuePair(kayValuePair: [string, string]) {
  return `${kayValuePair[0]}=${kayValuePair[1]}`;
}

main();
