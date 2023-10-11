/* eslint-disable prettier/prettier */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('stubs', (table) => {
    table.increments('id').primary();
    table.jsonb('stubsArr').notNullable();
    table
      .integer('ntypeId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('ntype');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stubs');
};
