import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex((knexConfig as Record<any, any>)[env]);
Model.knex(knex);

class GameHistory extends Model {
  static get tableName() {
    return 'gameHistory';
  }

  id!: number;
  game_id!: number;
  answer_id!: number;
  user_id!: number;
  approved_by_moderator!: number;
  count?: number;
}

export default GameHistory;