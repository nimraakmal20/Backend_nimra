/* eslint-disable prettier/prettier */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('apps', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.boolean('isActive').notNullable();
    table.boolean('isDeleted').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('apps');
};
