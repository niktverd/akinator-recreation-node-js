import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

// Инициализация knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

class QuestionRelease extends Model {
  static get tableName() {
    return 'question_block';
  }

  id!: number;
  answered_question_id!: number;
  blocked_question_id!: number;
}

export default QuestionRelease;