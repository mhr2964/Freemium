import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["client/dist/**", "client/node_modules/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module"
    }
  }
];
