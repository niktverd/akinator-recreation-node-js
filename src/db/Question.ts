import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex(knexConfig[env]);
Model.knex(knex);

class Question extends Model {
  static get tableName() {
    return 'questions';
  }

  id!: number;
  text!: string;
  hidden_from_ui!: boolean;
  shown_only_for_doctors!: boolean;
  possibility_of_this_is_next!: number;
}

export default Question;
