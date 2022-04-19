const { knex } = require("knex");
const conn = require("./connection");
const {
  client,
  connection: { host, port, user, password, database },
} = require("./knexfile");

const runInitLocalDatabase = async () => {
  try {
    // Lets create our database if it does not exist
    await knex({
      client,
      connection: {
        host,
        user,
        port,
        password,
      },
    }).raw(`CREATE DATABASE IF NOT EXISTS ${database}`);

    await conn.migrate.latest();
    await conn.seed.run();
  } catch (error) {
    console.log("[INIT DATABASE]", error);
  }
};

module.exports = { runInitLocalDatabase };
