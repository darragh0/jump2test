import { ErrMsg } from "./const";

type OkVariant<T> = { ok: true; value: T };
type ErrVariant = { ok: false; error: ErrMsg | string };
type Result<T> = OkVariant<T> | ErrVariant;

export { ErrVariant, OkVariant, Result };
