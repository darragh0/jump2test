/** Error messages */
enum ErrMsg {
  INVALID_FILE = "Invalid file path format",
  NOT_SUPPORTED = "Action not supported",
  UNSUPPORTED_FRAMEWORK = "Unsupported framework",
  NO_PACKAGE_JSON = "No `package.json` found",
  MISSING_EMBER_APP = "Missing `app/` directory",
  MAYBE_ALREADY_IN_TEST = "🤔 This seems like a test file, but it's not in `tests/` or `app/`",
  MAYBE_TEST_IN_APP_DIR = "🤔 This seems like a test file, but it's in `app/`",
  ALREADY_IN_TEST = "Already in a test file!",
  UNSUPPORTED_FILE = "Unsupported file type",
}

/** Info messages (not an error) */
enum InfoMsg {
  NO_ACTIVE_EDITOR = "No active editor",
  NOT_IN_FILE = "You can only use this command in a file",
  NO_TESTS = "No test files found",
}

export { ErrMsg, InfoMsg };
