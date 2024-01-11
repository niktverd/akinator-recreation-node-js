import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex(knexConfig[env]);
Model.knex(knex);

class Answer extends Model {
  static get tableName() {
    return 'answers';
  }

  id!: number;
  text!: string;
  possibility!: number;
  countOfGamesWhenWasAsTarget!: number;
}

export default Answer;