const { PrismaClient } = require('../src/generated/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Current date:', new Date());
    
    const slots = await prisma.slot.findMany({
      where: {
        status: 'available',
        startTime: { gte: new Date() }
      },
      include: { coach: { select: { firstName: true, lastName: true } } }
    });
    
    console.log('Available future slots:', slots.length);
    slots.forEach(s => {
      console.log(`- ${s.title} | Start: ${s.startTime}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
