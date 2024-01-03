import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

// Инициализация knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

class Question extends Model {
  static get tableName() {
    return 'questions';
  }

  id!: number;
  login!: string;
  is_doctor!: boolean;
  shown_only_for_doctors!: boolean;
}

export default Question;