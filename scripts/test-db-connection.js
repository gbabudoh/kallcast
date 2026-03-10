const { PrismaClient } = require('../src/generated/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('Connected to database');
    
    // Try a simple query
    const count = await prisma.user.count();
    console.log('User count:', count);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
