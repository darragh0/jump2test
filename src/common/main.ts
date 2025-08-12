import fs from "fs";
import { EmberErr } from "../finders/ember/const";
import { getEmberSearchTerm } from "../finders/ember/main";
import { CommonErr } from "./const";
import { Result } from "./type";

export function getTestQuery(
  filePath: string
): Result<string, CommonErr | EmberErr> {
  if (!filePath || filePath.trim() === "")
    return { err: CommonErr.INVALID_FILE };

  // should not happen
  if (!fs.existsSync(filePath)) return { err: CommonErr.NOT_IN_FILE };

  const query = getEmberSearchTerm(filePath);
  if (query.err === undefined && query.data !== undefined) return query;

  return { err: query.err };
}
