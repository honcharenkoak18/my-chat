'use strict';
const UserService = require('./User.Service');

/**
 * повертає перелік користувачів,
 * з якими у користувача userId відсутні чати(кімнати)
 * @param { number } userId
 * @returns { Promise<[{id : number, login: string, user_name: string,
 * state: number, created_at:Date, modified_at:Date}]> }
 */
async function getContacts(userId) {
  /**@type { UserService } */
  let userService;
  try {
    userService = await UserService.createService();
    const contacts = await userService.getContacts(userId);
    return contacts;
  } catch (error) {
    if (!error.type) {
      error.type = 'server error';
    }
    if (!error.source) {
      error.source = 'user index getContacts';
      console.log(error);
    }
    throw error;
  } finally {
    if (userService) {
      userService.release();
    }
  }
}

module.exports = { getContacts };
