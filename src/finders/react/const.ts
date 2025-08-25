const REACT_FILES: readonly string[] = ["next.config.js", "next.config.mjs"];

const REACT_DEPS: readonly string[] = ["react", "react-dom", "next", "gatsby", "@remix-run/react"];
const REACT_DEV_DEPS: readonly string[] = ["react", "react-dom", "@vitejs/plugin-react"];

const REACT_ALLOWED_EXTS: readonly string[] = [".js", ".ts", ".jsx", ".tsx"];

export { REACT_ALLOWED_EXTS, REACT_DEPS, REACT_DEV_DEPS, REACT_FILES };
