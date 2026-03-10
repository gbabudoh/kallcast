const { PrismaClient } = require('../src/generated/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete the booking
    const deleted = await prisma.booking.delete({
      where: { id: 'cmmk6mnbk0005v2vs5s55f9uw' }
    });

    console.log('Deleted booking:', deleted.id);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
