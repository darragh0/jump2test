import { ErrMsg } from "./const.js";
import { ErrVariant, OkVariant } from "./types.js";

function Ok<T>(value: T): OkVariant<T> {
  return { ok: true, value };
}

function Err(error: ErrMsg | string): ErrVariant {
  return { ok: false, error };
}

export { Err, Ok };
