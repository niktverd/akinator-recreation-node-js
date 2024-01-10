import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

// Инициализация knex.
const knex = Knex(knexConfig.development);
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