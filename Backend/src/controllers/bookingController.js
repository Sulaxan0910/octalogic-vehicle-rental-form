const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVehicleTypes = async (req, res) => {
  const wheels = parseInt(req.query.wheels); // 2 or 4
  const where = isNaN(wheels) ? {} : { wheels };
  const types = await prisma.vehicleType.findMany({ where });
  res.json(types);
};

exports.getVehiclesByType = async (req, res) => {
  const typeId = parseInt(req.params.typeId);
  const vehicles = await prisma.vehicle.findMany({ where: { vehicleTypeId: typeId } });
  res.json(vehicles);
};

exports.submitBooking = async (req, res) => {
  const { firstName, lastName, vehicleId, startDate, endDate } = req.body;

  const overlapping = await prisma.booking.findFirst({
    where: {
      vehicleId,
      OR: [
        { startDate: { lte: new Date(endDate), gte: new Date(startDate) } },
        { endDate: { lte: new Date(endDate), gte: new Date(startDate) } }
      ]
    }
  });

  if (overlapping) {
    return res.status(409).json({ message: 'Vehicle already booked for selected dates' });
  }

  const booking = await prisma.booking.create({
    data: { firstName, lastName, vehicleId, startDate: new Date(startDate), endDate: new Date(endDate) }
  });

  res.status(201).json(booking);
};
