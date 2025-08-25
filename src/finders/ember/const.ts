const EMBER_FILES: readonly string[] = ["app/router.js", "app.js", "config/environment.js"];

const EMBER_DEPS: readonly string[] = ["ember-source", "ember-cli"];
const EMBER_DEV_DEPS: readonly string[] = ["ember-source", "ember-cli"];

const EMBER_ALLOWED_EXTS: readonly string[] = [".js", ".ts"];

export { EMBER_ALLOWED_EXTS, EMBER_DEPS, EMBER_DEV_DEPS, EMBER_FILES };
