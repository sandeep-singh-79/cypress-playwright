// src/utils/testData.ts
export const testData = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  admin: {
    email: 'admin@juice-sh.op',
    password: 'admin123', // Default admin password, update if needed
  },
  user: {
    email: 'testuser@example.com',
    password: 'TestPassword123!',
  },
};
