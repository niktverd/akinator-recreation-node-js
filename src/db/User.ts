import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

// Инициализация knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  id!: number;
  login!: string;
  is_doctor!: boolean;
}

export default User;