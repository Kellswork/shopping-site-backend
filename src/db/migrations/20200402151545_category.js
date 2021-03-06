export function up(knex) {
  return knex.schema.createTable('category', (table) => {
    table.increments('id');
    table.text('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.raw('drop table if exists category cascade;');
}
