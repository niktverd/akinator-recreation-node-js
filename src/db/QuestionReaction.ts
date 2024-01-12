import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex((knexConfig as Record<any, any>)[env]);
Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'question_reaction';
  }

  id!: number;
  game_id!: number;
  question_id!: number;
  reaction_id!: number;
}

export default User;