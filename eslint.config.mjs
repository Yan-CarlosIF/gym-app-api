import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import SimpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: { js, "simple-import-sort": SimpleImportSort },
    extends: ["js/recommended"],
    rules: {
      "simple-import-sort/imports": "warn",
    },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
]);
