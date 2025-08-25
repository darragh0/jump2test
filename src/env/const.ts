import { EMBER_DEPS, EMBER_DEV_DEPS, EMBER_FILES } from "../finders/ember/const.js";
import { REACT_DEPS, REACT_DEV_DEPS, REACT_FILES } from "../finders/react/const.js";
import { FwIndicatorMap } from "./types.js";

/** Supported frameworks/libraries */
enum Framework {
  Ember = "Ember",
  React = "React",
}

/** Framework indicators */
const FwIndicators: Record<Framework, FwIndicatorMap> = {
  [Framework.Ember]: {
    deps: EMBER_DEPS,
    devDeps: EMBER_DEV_DEPS,
    files: EMBER_FILES,
  },
  [Framework.React]: {
    deps: REACT_DEPS,
    devDeps: REACT_DEV_DEPS,
    files: REACT_FILES,
  },
};

const MAX_ROOT_DIR_ITERATIONS = 100;

export { Framework, FwIndicators, MAX_ROOT_DIR_ITERATIONS };
