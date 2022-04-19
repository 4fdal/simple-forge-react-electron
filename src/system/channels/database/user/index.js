const { ipcMain } = require("electron");
const { getConnection } = require("../../../helpers/call-helper");
const moment = require("moment");

ipcMain.handle(
  "sync.users",
  async (
    event,
    [
      objectConnection = {},
      arraySyncData = [],
      actionParams = { isFreshDataTable: false },
    ]
  ) => {
    try {
      const rolesTableName = "roles";
      const usersTableName = "users";
      const conn = getConnection(objectConnection);

      if (actionParams?.isFreshDataTable) {
        await conn.table(usersTableName).delete();
      }

      for (let {
        id,
        name,
        username,
        password,
        role,
        role_id,
        created_at,
        updated_at,
      } of arraySyncData) {
        await conn
          .table(rolesTableName)
          .insert({
            ...role,
            created_at: moment(role.created_at).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment(role.updated_at).format("YYYY-MM-DD HH:mm:ss"),
          })
          .onConflict("id")
          .merge();

        await conn
          .table(usersTableName)
          .insert({
            id,
            name,
            username,
            password,
            role_id,
            created_at: moment(created_at).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment(updated_at).format("YYYY-MM-DD HH:mm:ss"),
          })
          .onConflict("id")
          .merge();
      }

      await conn.destroy();
    } catch (error) {
      throw error;
    }
  }
);

ipcMain.handle(
  "get.users",
  async (
    event,
    [
      objectConnection = {},
      queryFilter = {
        per_page: 10,
        page: 1,
        all: false,
        order: ["created_at", "desc"],
      },
    ]
  ) => {
    try {
      const usersTableName = "users";
      const conn = getConnection(objectConnection);
      const isAll = queryFilter.all ?? false;
      const per_page = queryFilter.per_page ?? 10;
      const page = queryFilter.page ?? 1;
      const order = queryFilter.order ?? ["created_at", "desc"];

      // get total for all data in database
      const [{ total }] = await conn.table(usersTableName).count("id as total");

      let data = conn
        .table(usersTableName)
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
        .innerJoin("roles", conn.ref("roles.id"), conn.ref("users.role_id"));

      // get data page and per page
      if (per_page && page && !isAll) {
        data = data.limit(per_page).offset((page - 1) * per_page);
      }

      // order created at desc
      data = data.orderBy(order[0], order[1]);

      data = (await data).map(item => {
        let newItem = {};
        for (const key in item) {
          let valueItem = item[key];
          let splitKeyItem = key.split("__");

          if (splitKeyItem.length > 1) {
            const [relationName, relationKey] = splitKeyItem;
            if (!newItem[relationName]) newItem[relationName] = {};
            newItem[relationName][relationKey] = valueItem;
          } else {
            newItem[key] = valueItem;
          }
        }

        return newItem;
      });

      await conn.destroy();

      return {
        data,
        per_page: per_page,
        current_page: page,
        total,
      };
    } catch (error) {
      throw error;
    }
  }
);
