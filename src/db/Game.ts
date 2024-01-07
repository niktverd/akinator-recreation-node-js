import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

// Инициализация knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

class Game extends Model {
  static get tableName() {
    return 'games';
  }

  id!: number;
  user_id!: string;
  is_finished!: boolean;
  is_succeed!: boolean;
}

export default Game;
