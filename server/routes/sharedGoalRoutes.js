// server/routes/sharedGoalRoutes.js
const express = require('express');
const cors    = require('cors');
const router  = express.Router();
const SharedGoal = require('../models/SharedGoal');

router.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://atomquest-portal-chi.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 1. Admin — create and push a shared goal to employees
router.post('/push', async (req, res) => {
  try {
    const { title, description, thrustArea, uom, target, cycleYear, createdBy, createdByName, assignees } = req.body;
    // assignees: [{ employeeId, employeeName }]
    if (!assignees || !Array.isArray(assignees) || assignees.length === 0) {
      return res.status(400).json({ message: 'At least one assignee is required.' });
    }
    const assignments = assignees.map(a => ({
      employeeId: a.employeeId,
      employeeName: a.employeeName,
      actualAchievement: null,
      goalStatus: 'Not Started',
      lastUpdated: null
    }));
    const sg = new SharedGoal({ title, description, thrustArea, uom, target, cycleYear, createdBy, createdByName, assignments });
    await sg.save();
    res.status(201).json({ message: 'Shared goal pushed successfully.', data: sg });
  } catch (err) {
    console.error('❌ Shared goal push crash:', err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Admin — get all shared goals
router.get('/all', async (req, res) => {
  try {
    const goals = await SharedGoal.find({}).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (err) {
    console.error('❌ Shared goal fetch all crash:', err);
    res.status(500).json({ message: err.message });
  }
});

// 3. Admin — delete a shared goal
router.delete('/:goalId', async (req, res) => {
  try {
    const goal = await SharedGoal.findByIdAndDelete(req.params.goalId);
    if (!goal) return res.status(404).json({ message: 'Shared goal not found.' });
    res.status(200).json({ message: 'Shared goal deleted.' });
  } catch (err) {
    console.error('❌ Shared goal delete crash:', err);
    res.status(500).json({ message: err.message });
  }
});

// 4. Employee — get shared goals assigned to them
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const all = await SharedGoal.find({ 'assignments.employeeId': req.params.employeeId });
    // Shape: return each goal with only this employee's assignment slice
    const result = all.map(sg => {
      const assignment = sg.assignments.find(a => a.employeeId === req.params.employeeId);
      return {
        _id: sg._id,
        title: sg.title,
        description: sg.description,
        thrustArea: sg.thrustArea,
        uom: sg.uom,
        target: sg.target,
        cycleYear: sg.cycleYear,
        assignment
      };
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Shared goal employee fetch crash:', err);
    res.status(500).json({ message: err.message });
  }
});

// 5. Employee — update their achievement on a shared goal
router.put('/checkin/:goalId/:employeeId', async (req, res) => {
  try {
    const { actualAchievement, goalStatus } = req.body;
    const sg = await SharedGoal.findById(req.params.goalId);
    if (!sg) return res.status(404).json({ message: 'Shared goal not found.' });
    const assignment = sg.assignments.find(a => a.employeeId === req.params.employeeId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found for this employee.' });
    assignment.actualAchievement = actualAchievement;
    assignment.goalStatus = goalStatus;
    assignment.lastUpdated = new Date();
    sg.markModified('assignments');
    await sg.save();
    res.status(200).json({ message: 'Shared goal check-in saved.', data: sg });
  } catch (err) {
    console.error('❌ Shared goal check-in crash:', err);
    res.status(500).json({ message: err.message });
  }
});

// 6. Manager — get shared goals for their team (by managerId → look up which employees report to this manager)
// Since SharedGoal doesn't store managerId, we accept a list of employeeIds via query param
// e.g. GET /api/shared-goals/team?employeeIds=EMP101,EMP102
router.get('/team', async (req, res) => {
  try {
    const ids = req.query.employeeIds ? req.query.employeeIds.split(',') : [];
    if (ids.length === 0) return res.status(200).json([]);
    const all = await SharedGoal.find({ 'assignments.employeeId': { $in: ids } }).sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (err) {
    console.error('❌ Shared goal team fetch crash:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
