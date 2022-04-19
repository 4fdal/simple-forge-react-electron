const { ipcMain } = require("electron");
const { knex } = require("knex");
const { getConnection } = require("../../helpers/call-helper");

ipcMain.handle("database.test.connection", async (event, args) => {
  const { host, port, user, password, database } = args[0];

  return getConnection({ host, port, user, password, database }).raw(
    `select true`
  );
});
