'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('news', [
      { title: 'Tech Giants Report Record Profits', content: 'Major technology companies have reported record-breaking profits this quarter, driven by strong demand for cloud computing and AI services. Analysts predict continued growth throughout the year as digital transformation accelerates across industries.', imageUrl: 'https://picsum.photos/seed/tech1/800/400', categoryId: 2, authorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'New Health Guidelines Released', content: 'Health authorities have released updated guidelines recommending increased physical activity and dietary changes. The new recommendations emphasize the importance of regular exercise, a balanced diet, and mental health awareness for overall wellbeing.', imageUrl: 'https://picsum.photos/seed/health1/800/400', categoryId: 5, authorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Championship Finals This Weekend', content: 'The much-anticipated championship finals are set to take place this weekend, drawing fans from across the country. Both teams have been in excellent form and promise an exciting match for spectators at the stadium and watching from home.', imageUrl: 'https://picsum.photos/seed/sports1/800/400', categoryId: 3, authorId: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('news', null, {});
  }
};