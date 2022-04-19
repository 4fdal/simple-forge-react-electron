/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = ({ schema }) => {
  return schema.createTableIfNotExists("roles", (table) => {
    table.bigIncrements("id").unsigned().primary();
    table.string("name").nullable();
    table.string("level").nullable();
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = ({ schema }) => {
  return schema.dropTableIfExists("roles");
};
