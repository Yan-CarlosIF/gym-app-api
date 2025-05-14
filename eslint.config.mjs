import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import SimpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "simple-import-sort": SimpleImportSort,
    },
    // rules: {
    //   "simple-import-sort/import": "warn",
    // },
  },
  tseslint.configs.recommended,
]);
