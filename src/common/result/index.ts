import { ErrMsg } from "@common/msg/const";
import { ErrVariant, OkVariant } from "@common/result/types";

function Ok<T>(value: T): OkVariant<T> {
  return { ok: true, value };
}

function Err(error: ErrMsg | string): ErrVariant {
  return { ok: false, error };
}

export { Err, Ok };
