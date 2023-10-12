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
    table.boolean('isProcessed').notNullable();
    table.timestamps(true, true);
    table
      .integer('ntypeId')
      .unsigned()
      .references('id')
      .inTable('ntype') // Reference the 'notifications' table
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('eventId')
      .unsigned()
      .references('id')
      .inTable('event') // Reference the 'notifications' table
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
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
  return knex.schema.dropTable('message');
};
