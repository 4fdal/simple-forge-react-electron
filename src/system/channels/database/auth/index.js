const { ipcMain } = require("electron");
const bcrypt = require("bcryptjs");
const { getConnection } = require("../../../helpers/call-helper");

ipcMain.handle(
  "auth.login",
  async (event, [objectConnection = {}, { username, password }]) => {
    try {
      const userTableName = "users";
      let conn = getConnection(objectConnection);

      let user = await conn
        .table(userTableName)
        .select(
          "users.id",
          "users.name",
          "users.username",
          "users.password",
          "users.role_id",
          "users.created_at",
          "users.updated_at",
          "roles.id as role__id",
          "roles.name as role__name",
          "roles.level as role__level",
          "roles.created_at as role__created_at",
          "roles.updated_at as role__updated_at"
        )
        .innerJoin("roles", conn.ref("roles.id"), conn.ref("users.role_id"))
        .where("username", username)
        .first();

      await conn.destroy();

      let hasAuthenticate = false;
      if (user) {
        user = {
          id: user.id,
          name: user.name,
          username: user.username,
          password: user.password,
          role_id: user.role_id,
          created_at: user.created_at,
          updated_at: user.updated_at,
          role: {
            id: user.role__id,
            name: user.role__name,
            level: user.role__level,
            created_at: user.role__created_at,
            updated_at: user.role__updated_at,
          },
        };
        user.password = user.password.replace("$2y$", "$2a$");
        hasAuthenticate = await bcrypt.compare(password, user.password);
      }

      return {
        has_authenticate: hasAuthenticate,
        access_token: password,
        user: hasAuthenticate ? user : null,
      };
    } catch (error) {
      throw error;
    }
  }
);
