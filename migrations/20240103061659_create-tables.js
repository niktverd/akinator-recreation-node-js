exports.up = function(knex) {
    return Promise.all([

    
    knex.schema.createTable('answers', table => {
      table.increments('id');
      table.string('text');
      table.timestamps();
    }),

    knex.schema.createTable('questions', table => {
        table.increments('id');
        table.string('text');
        table.boolean('hidden_from_ui');
        table.boolean('shown_only_for_doctors');
        table.timestamps();
      }),

    knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('login');
        table.boolean('is_doctor');
        table.timestamps();
      }),

    knex.schema.createTable('gameDetails', table => {
        table.increments('id');
        table.integer('game_id');
        table.integer('question_id');
        table.integer('reaction_id');
        table.timestamps();
      }),

    knex.schema.createTable('gameHistory', table => {
        table.increments('id');
        table.integer('game_id');
        table.integer('user_id');
        table.integer('answer_id');
        table.integer('approved_by_moderator');
        table.timestamps();
      }),
    ]);
  };
  
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('answers'),
        knex.schema.dropTable('questions'),
        knex.schema.dropTable('users'),
        knex.schema.dropTable('gameDetails'),
        knex.schema.dropTable('gameHistory'),
    ]);
  };