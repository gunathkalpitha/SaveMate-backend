// backend/routes/personalTransactionRoutes.js
const express = require('express');
const router = express.Router();
const PersonalTransaction = require('../models/PersonalTransaction');

// Middleware to check member in body or query
function requireMember(req, res, next) {
  const member = req.body.member || req.query.member;
  if (!member) return res.status(400).json({ message: "Member required" });
  req.member = member;
  next();
}

// GET all transactions for a member
router.get("/", async (req, res) => {
  const member = req.query.member;
  if (!member) return res.status(400).json({ message: "Member required" });

  const txs = await PersonalTransaction.find({ member }).sort({ date: -1 });
  res.json(txs);
});

// GET summary for a member
router.get("/summary", async (req, res) => {
  const member = req.query.member;
  if (!member) return res.status(400).json({ message: "Member required" });

  const txs = await PersonalTransaction.find({ member });
  const currentBalance = txs.reduce((sum, t) => sum + t.amount, 0);
  const liabilities = txs.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totals = { Food: 0, Health: 0, Bills: 0, Others: 0 };
  txs.forEach(t => {
    if (t.category in totals && t.amount < 0) totals[t.category] += Math.abs(t.amount);
  });

  res.json({ currentBalance, liabilities, totals });
});

// Add a new personal transaction
router.post('/', requireMember, async (req, res) => {
  try {
    const { amount, note, date, category } = req.body;

    const transaction = new PersonalTransaction({
      member: req.member,
      amount,
      note,
      date: date || Date.now(),
      category,
    });

    const savedTransaction = await transaction.save();
    res.json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a personal transaction
// Update a personal transaction
router.put('/:id', requireMember, async (req, res) => {
  try {
    const { amount, note, category, date } = req.body;
    const transaction = await PersonalTransaction.findOne({ _id: req.params.id, member: req.member });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (amount !== undefined) transaction.amount = amount;
    if (note !== undefined) transaction.note = note;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a personal transaction
router.delete('/:id', requireMember, async (req, res) => {
  try {
    console.log("Deleting transaction:", req.params.id, "for member:", req.member); // Debug log

    const transaction = await PersonalTransaction.findOne({
      _id: req.params.id,
      member: req.member.trim() // trim to avoid extra spaces
    });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
