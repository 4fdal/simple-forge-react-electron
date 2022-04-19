const knexfile = require("./knexfile.js");
const { knex } = require("knex");
const connection = knex(knexfile);

module.exports = connection;
