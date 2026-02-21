'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      { name: 'Politics', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Technology', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sports', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Business', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Health', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};