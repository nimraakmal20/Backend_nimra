/* eslint-disable prettier/prettier */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('message', (table) => {
    table.increments('id');
    table.string('sendto').notNullable();
    table.string('messageSubject').notNullable();
    table.string('messageBody').notNullable();
    table.timestamps(true, true);
    table
      .integer('ntypeId')
      .unsigned()
      .references('id')
      .inTable('event') // Reference the 'notifications' table
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('message');
};
