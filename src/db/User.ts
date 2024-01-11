import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex(knexConfig[env]);
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