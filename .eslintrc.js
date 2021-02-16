// https://eslint.org/docs/user-guide/configuring#configuring-rules
const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ["eslint-config-react-app"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/no-default-export": ERROR,
    // not working, use 'no-restricted-imports' instead
    // "import/no-restricted-paths": [
    //   ERROR,
    //   {
    //     zones: [{ target: "app", from: "app/data" }],
    //     // basePath: "./src",
    //   },
    // ],
    "no-restricted-imports": [
      ERROR,
      {
        paths: [
          {
            name: "app/data/colors.db",
            message:
              "Please do not import db object directly. use getter method instead",
          },
          {
            name: "app/data/palettes.db",
            message:
              "Please do not import db object directly. use getter method instead",
          },
          {
            name: "app/data/items.db",
            message:
              "Please do not import db object directly. use getter method instead",
          },
          {
            name: "app/data/animations.db",
            message:
              "Please do not import db object directly. use getter method instead",
          },
        ],
        // currently, it's not possible to specify custom message for a pattern.
        // As a consequence, we have to hardcode forbidden module name for now
        // https://github.com/eslint/eslint/issues/11843
        // patterns: ["app/data/*.db"],
      },
    ],
  },
  overrides: [
    {
      files: ["./src/app/data/*.ts"],
      rules: {
        "no-restricted-imports": OFF,
      },
    },
  ],
};
