const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Add vehicle types
  const suv = await prisma.vehicleType.create({ data: { name: 'SUV', wheels: 4 } });
  const sedan = await prisma.vehicleType.create({ data: { name: 'Sedan', wheels: 4 } });
  const hatchback = await prisma.vehicleType.create({ data: { name: 'Hatchback', wheels: 4 } });
  const cruiser = await prisma.vehicleType.create({ data: { name: 'Cruiser', wheels: 2 } });

  // Add vehicles
  await prisma.vehicle.createMany({
    data: [
      { model: 'SUV-X', vehicleTypeId: suv.id },
      { model: 'Sedan-Z', vehicleTypeId: sedan.id },
      { model: 'Hatch-123', vehicleTypeId: hatchback.id },
      { model: 'Cruiser-900', vehicleTypeId: cruiser.id },
    ],
  });
}

main()
  .then(() => console.log('Seeded successfully'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
