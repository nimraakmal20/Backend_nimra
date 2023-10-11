/* eslint-disable prettier/prettier */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('event', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.boolean('isActive').notNullable();
    table.boolean('isDeleted').notNullable();
    table.timestamps(true, true);
    table
      .integer('applicationId')
      .unsigned()
      .references('id')
      .inTable('apps') // Reference the 'notifications' table
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
