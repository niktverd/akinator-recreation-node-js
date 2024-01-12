import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NEXT_PUBLIC_APP_ENV || 'development'
// Инициализация knex.
const knex = Knex((knexConfig as Record<any, any>)[env]);
Model.knex(knex);

class ReactionReactionGroupRelation extends Model {
  static get tableName() {
    return 'reaction-reaction-group-relations';
  }

  id!: number;
  reaction_id!: number;
  reaction_group_id!: number;
}

export default ReactionReactionGroupRelation;