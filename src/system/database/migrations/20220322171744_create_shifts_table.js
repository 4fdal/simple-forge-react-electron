/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = ({ schema }) => {
  return schema.createTableIfNotExists("shifts", (table) => {
    table.bigIncrements("id").unsigned().primary();
    table.string("name").nullable();
    table.time("start_time").nullable();
    table.time("end_time").nullable();
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = ({ schema }) => {
  return schema.dropTableIfExists("shifts");
};
