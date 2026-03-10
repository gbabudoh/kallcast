const { PrismaClient } = require('../src/generated/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all bookings
    const deleted = await prisma.booking.deleteMany({});
    console.log('Deleted bookings:', deleted.count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
