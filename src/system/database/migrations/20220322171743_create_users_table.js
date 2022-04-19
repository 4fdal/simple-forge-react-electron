/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = ({ schema }) => {
  return schema.createTableIfNotExists("users", (table) => {
    table.bigIncrements("id").unsigned().primary();
    table.string("name").nullable();
    table.string("username").nullable();
    table.string("password").nullable();
    table.bigInteger("role_id").nullable().unsigned();
    table.dateTime("created_at").nullable();
    table.dateTime("updated_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = ({ schema }) => {
  return schema.dropTableIfExists("users");
};
