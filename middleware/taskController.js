const db = require('../db');

exports.getTasks = async (req, res) => {
  try {
    const { sortBy = 'status', order = 'asc' } = req.query;

    const allowedFields = ['id', 'name', 'status', 'deadline', 'createdAt', 'updatedAt'];
    const allowedOrders = ['asc', 'desc'];

    const sortField = allowedFields.includes(sortBy) ? sortBy : 'status';
    const sortOrder = allowedOrders.includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';

    const [tasks] = await db.query(
      `SELECT * FROM tasks ORDER BY \`${sortField}\` ${sortOrder.toUpperCase()}`
    );

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Gagal mengambil task:", err);
    res.status(500).json({ error: "Gagal mengambil task" });
  }
};
