exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('reactions', table => {
            table.increments('id');
            table.string('slug');
            table.timestamps();
        }),
        knex.schema.createTable('reaction-groups', table => {
            table.increments('id');
            table.string('slug');
            table.timestamps();
        }),
        knex.schema.createTable('reaction-reaction-group-relations', table => {
            table.increments('id');
            table.integer('reaction_id');
            table.integer('reaction_group_id');
            table.timestamps();
        }),
        knex.schema.table('questions', function(table) {
            table.integer('reaction_group').notNullable().defaultTo(1);
        }),
    ]);
  };

  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('reactions'),
        knex.schema.dropTable('reaction-groups'),
        knex.schema.dropTable('reaction-group-relations'),
        knex.schema.table('questions', function(table) {
            table.dropColumn('reaction_group');
        }),
    ]);
  }; 