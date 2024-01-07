exports.up = function(knex) {
    return Promise.all([

    
    knex.schema.createTable('question_reaction', table => {
      table.increments('id');
      table.integer('game_id');
      table.integer('question_id');
      table.integer('reaction_id');
      table.timestamps();
    }),
    ]);
  };
  
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('question_reaction'),
    ]);
  };