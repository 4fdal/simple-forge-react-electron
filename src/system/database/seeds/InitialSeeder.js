const moment = require("moment");
const conn = require("../connection");

exports.seed = async function (knex) {
  const ADMINISTRATOR_LEVEL = "administrator";
  const OPERATOR_LEVEL = "operator";

  [
    {
      id: 1,
      name: "admin",
      username: "admin",
      password: "$2y$10$Y4.QYnmmCUM18vu3mbnOWe/GCOHHu/e.ocbuVrdL4fl8IqzOoxn/O",
      // password : "secret"
      roleId: 1,
      roleName: ADMINISTRATOR_LEVEL,
      roleLevel: ADMINISTRATOR_LEVEL,
    },
    {
      id: 2,
      name: "operator",
      username: "operator",
      password: "$2y$10$Y4.QYnmmCUM18vu3mbnOWe/GCOHHu/e.ocbuVrdL4fl8IqzOoxn/O",
      // password : "secret"
      roleId: 2,
      roleName: OPERATOR_LEVEL,
      roleLevel: OPERATOR_LEVEL,
    },
  ].forEach(
    async ({ id, name, password, username, roleLevel, roleName, roleId }) => {
      const role_id = await conn
        .table("roles")
        .insert({
          id: roleId,
          name: roleName,
          level: roleLevel,
          created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
        .onConflict("id")
        .merge();

      await conn
        .table("users")
        .insert({
          id,
          name,
          username,
          password,
          role_id,
          created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
        .onConflict("id")
        .merge();
    }
  );
  console.info("\n[SEEDER]", "Complete Generate User Account");

  [
    {
      name: "Pagi",
      start_time: "08:00",
      end_time: "12:00",
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      name: "Siang",
      start_time: "13:00",
      end_time: "17:00",
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      name: "Malam",
      start_time: "20:00",
      end_time: "24:00",
      created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
  ].forEach(async (shift, id) => {
    await conn
      .table("shifts")
      .insert({
        id,
        ...shift,
      })
      .onConflict("id")
      .merge();
  });
  console.info("\n[SEEDER]", "Complete Generate Shift");
};
