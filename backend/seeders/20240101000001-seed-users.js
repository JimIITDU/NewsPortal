'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const hash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('user123', 10);
    await queryInterface.bulkInsert('users', [
      { name: 'Admin User', email: 'admin@newsportal.com', password: hash, role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Regular User', email: 'user@newsportal.com', password: userHash, role: 'user', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};