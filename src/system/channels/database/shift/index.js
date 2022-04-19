const { ipcMain } = require("electron");
const moment = require("moment");
const { getConnection } = require("../../../helpers/call-helper");

ipcMain.handle(
  "sync.shifts",
  async (
    event,
    [
      objectConnection = {},
      arraySyncDataShifts = [],
      actionParams = { isFreshDataTable: false },
    ]
  ) => {
    try {
      const shiftsTableName = "shifts";
      const conn = getConnection(objectConnection);

      if (actionParams?.isFreshDataTable) {
        await conn.table(shiftsTableName).delete();
      }

      for (let {
        id,
        name,
        start_time,
        end_time,
        created_at,
        updated_at,
      } of arraySyncDataShifts) {
        await conn
          .table(shiftsTableName)
          .insert({
            id,
            name,
            start_time,
            end_time,
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
  "get.shifts",
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
      const shiftsTableName = "shifts";
      const conn = getConnection(objectConnection);
      const isAll = queryFilter.all ?? false;
      const per_page = queryFilter.per_page ?? 10;
      const page = queryFilter.page ?? 1;
      const order = queryFilter.order ?? ["created_at", "desc"];

      // get total for all data in database
      const [{ total }] = await conn
        .table(shiftsTableName)
        .count("id as total");

      let data = conn
        .table(shiftsTableName)
        .select(
          "shifts.id",
          "shifts.name",
          "shifts.start_time",
          "shifts.end_time",
          "shifts.created_at",
          "shifts.updated_at"
        );

      // get data page and per page
      if (per_page && page && !isAll) {
        data = data.limit(per_page).offset((page - 1) * per_page);
      }

      // order created at desc
      data = data.orderBy(order[0], order[1]);

      data = await data;

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
