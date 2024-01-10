exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('question_release', table => {
            table.increments('id');
            table.integer('asked_question_id');
            table.integer('released_question_id');
            table.timestamps();
        }),

        knex.schema.createTable('question_block', table => {
            table.increments('id');
            table.integer('answered_question_id');
            table.integer('blocked_question_id');
            table.timestamps();
        }),
    ]);
  };
  
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('question_reaction'),
    ]);
  };