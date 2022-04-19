const { knex } = require("knex");

function getConnection({ host, port, user, password, database }) {
  let conn = knex({
    client: require(__dirname +
      "/../../../node_modules/knex/lib/dialects/mysql2"),
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
  });

  return conn;
}

module.exports = {
  getConnection,
};
