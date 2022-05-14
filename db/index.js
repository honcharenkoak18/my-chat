'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
let pool;
try {
  if (process.env.NODE_ENV !== 'production') {
    pool = new Pool({
      connectionString,
      ssl: false,
    });
  } else {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
} catch (error) {
  console.log(error);
  throw error;
}

console.log('create new Pool');
module.exports = {
  getPool() {
    return pool;
  },
  /** повертає результат виконання sql
   * @param { String } sql
   * @param { Array } params
   * @returns { Promise<PgResult> }
   */
  async query(sql, params) {
    try {
      const result = await pool.query(sql, params);
      return result;
    } catch (error) {
      if (!error.type) {
        error.type = 'db error';
      }
      if (!error.source) {
        error.source = 'db index query';
        console.log(error);
      }
      throw error;
    }
  },

  /** повертає нового клієнта з пула
   * @returns { Promise< PoolClient >}
   */
  async getClient() {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      if (!error.type) {
        error.type = 'db error';
      }
      if (!error.source) {
        error.source = 'db index getClient';
        console.log(error);
      }
      throw error;
    }
  },

  /** виконує SQL запит з вказаним клієнтом
   * @param { PoolClient } client
   * @param { String } sql
   * @param {Array} params
   * @returns  { Promise<any> } повертає результат виконання sql
   */
  async clientQuery(client, sql, params) {
    try {
      const result = await client.query(sql, params);
      return result;
    } catch (error) {
      if (!error.type) {
        error.type = 'db error';
      }
      if (!error.source) {
        error.source = 'db index clientQuery';
        console.log(error);
      }
      throw error;
    }
  },
};
