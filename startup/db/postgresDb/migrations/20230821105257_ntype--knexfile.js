/* eslint-disable prettier/prettier */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('ntype', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('templateSubject').notNullable();
    table.string('templateBody').notNullable();
    table.boolean('isActive').notNullable();
    table.boolean('isDeleted').notNullable();
    table.jsonb('tags').notNullable();
    table.timestamps(true, true);
    table
      .integer('eventId')
      .unsigned()
      .references('id')
      .inTable('event') // Reference the 'notifications' table
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ntype');
};
