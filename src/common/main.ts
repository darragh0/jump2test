import { ErrMsg } from "./const";
import { ErrVariant, OkVariant } from "./types";

function Ok<T>(value: T): OkVariant<T> {
  return { ok: true, value };
}

function Err(error: ErrMsg | string): ErrVariant {
  return { ok: false, error };
}

export { Err, Ok };
