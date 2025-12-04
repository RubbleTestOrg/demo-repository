import noCommentedCode from "eslint-plugin-no-commented-code";

const commonGlobals = {
  console: "readonly",
  process: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  module: "readonly",
  require: "readonly",
  exports: "readonly",
  Buffer: "readonly",
  global: "readonly",
};

const commonRules = {
  "no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
  "no-commented-code/no-commented-code": "error",
};

export default [
  // Configuration for ES modules (.js, .mjs)
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: commonGlobals,
    },
    plugins: {
      "no-commented-code": noCommentedCode,
    },
    rules: commonRules,
  },
  // Configuration for CommonJS files (.cjs)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: commonGlobals,
    },
    plugins: {
      "no-commented-code": noCommentedCode,
    },
    rules: commonRules,
  },
];
