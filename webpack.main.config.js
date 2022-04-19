module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  externals: {
    sqlite3: "sqlite3",
    "better-sqlite3": "better-sqlite3",
    tedious: "tedious",
    "@vscode/sqlite3": "@vscode/sqlite3",
    mysql: "mysql",
    mariasql: "mariasql",
    oracle: "oracle",
    "strong-oracle": "strong-oracle",
    oracledb: "oracledb",
    pg: "pg",
    "pg-query-stream": "pg-query-stream",
    serialport: "serialport",
    mssql: "mssql",
    "mssql/package.json": "mssql/package.json",
    "mssql/lib/base": "mssql/lib/base",
    printer: "commonjs printer",
    nock: "nock",
    "aws-sdk": "aws-sdk",
    "mock-aws-s3": "mock-aws-s3",
    "pg-native": "pg-native",
  },
  optimization: {
    minimize: false,
  },
};
