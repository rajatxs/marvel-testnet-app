import path from "path";
import url from "url";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";

// @ts-ignore
export const rootDir = path.dirname(url.fileURLToPath(import.meta.url));

export const blockStorage = new JsonDB(
   new Config(path.join(rootDir, "data/blocks.json"), true, true, "/")
);

export const blockMapStorage = new JsonDB(
   new Config(path.join(rootDir, "data/blocks.map.json"), true, true, "/")
);
