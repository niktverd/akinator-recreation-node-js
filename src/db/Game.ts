import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex((knexConfig as Record<any, any>)[env]);
Model.knex(knex);

class Game extends Model {
  static get tableName() {
    return 'games';
  }

  id!: number;
  user_id!: number;
  is_finished!: boolean;
  is_succeed!: boolean;
}

export default Game;
