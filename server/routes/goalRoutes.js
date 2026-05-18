const express = require('express');
const cors = require('cors');
const router = express.Router();
const GoalSheet = require('../models/GoalSheet');
 
router.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://atomquest-portal-chi.vercel.app'  // ← add this
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
 
// 1. Submit a Goal Sheet (Employee)
router.post('/submit', async (req, res) => {
  try {
    const { employeeId, employeeName, managerId, goals } = req.body;
 
    if (!goals || !Array.isArray(goals)) {
      return res.status(400).json({ message: "Validation Error: The goals collection must be a valid populated array." });
    }
 
    const totalWeightage = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);
    if (totalWeightage !== 100) {
      return res.status(400).json({
        message: `Validation Error: Total weightage must equal 100%. Current total: ${totalWeightage}%`
      });
    }
 
    const newSheet = new GoalSheet({
      employeeId,
      employeeName,
      managerId,
      goals,
      status: 'Pending Approval'
    });
 
    await newSheet.save();

    // Audit: log submission
    newSheet.auditTrail = [{ actorId: employeeId, actorName: employeeName, actorRole: 'Employee', action: 'Submitted', details: `${goals.length} goals submitted`, timestamp: new Date() }];
    await newSheet.save();

    res.status(201).json({ message: "Goal Sheet submitted successfully!", data: newSheet });
  } catch (error) {
    console.error("❌ Submit crash:", error);
    res.status(500).json({ message: `Database Write Failure: ${error.message}` });
  }
});
 
// 2. Fetch all sheets for an Employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const sheets = await GoalSheet.find({ employeeId: req.params.employeeId });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("❌ Employee fetch crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 3. Fetch all sheets for a Manager
router.get('/manager/:managerId', async (req, res) => {
  try {
    const sheets = await GoalSheet.find({ managerId: req.params.managerId });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("❌ Manager fetch crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 4. Approve or Return Goal Sheet (Manager)
router.put('/review/:id', async (req, res) => {
  try {
    const { status, goals } = req.body;
    const isLocked = status === 'Approved';
 
    const updatedSheet = await GoalSheet.findByIdAndUpdate(
      req.params.id,
      { status, goals, isLocked },
      { new: true }
    );

    // Audit: log manager decision
    const actorName = req.body.actorName || 'Manager';
    const actorId   = req.body.actorId   || 'MGR';
    if (!updatedSheet.auditTrail) updatedSheet.auditTrail = [];
    updatedSheet.auditTrail.push({ actorId, actorName, actorRole: 'Manager', action: status === 'Approved' ? 'Approved' : 'Returned', details: `Sheet status set to ${status}`, timestamp: new Date() });
    updatedSheet.markModified('auditTrail');
    await updatedSheet.save();

    res.status(200).json({ message: `Goal sheet status updated to ${status}`, data: updatedSheet });
  } catch (error) {
    console.error("❌ Review crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 5. Employee logs actual achievement per goal (Phase 2)
router.put('/checkin/:sheetId', async (req, res) => {
  try {
    const { goals } = req.body;
    const sheet = await GoalSheet.findById(req.params.sheetId);
    if (!sheet) return res.status(404).json({ message: "Goal sheet not found." });
 
    goals.forEach(({ _id, actualAchievement, goalStatus }) => {
      const goal = sheet.goals.id(_id);
      if (goal) {
        goal.actualAchievement = actualAchievement;
        goal.goalStatus = goalStatus;
      }
    });
 
    await sheet.save();

    // Audit: log check-in
    const actorName = req.body.actorName || sheet.employeeName;
    if (!sheet.auditTrail) sheet.auditTrail = [];
    sheet.auditTrail.push({ actorId: sheet.employeeId, actorName, actorRole: 'Employee', action: 'Check-in Updated', details: `Achievement data updated for ${goals.length} goals`, timestamp: new Date() });
    sheet.markModified('auditTrail');
    await sheet.save();

    res.status(200).json({ message: "Check-in data saved successfully.", data: sheet });
  } catch (error) {
    console.error("❌ Employee check-in crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 6. Manager adds quarterly check-in comment (Phase 2)
router.put('/manager-checkin/:sheetId', async (req, res) => {
  try {
    const { quarter, comment } = req.body;
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      return res.status(400).json({ message: "Invalid quarter. Must be Q1, Q2, Q3, or Q4." });
    }
 
    const sheet = await GoalSheet.findById(req.params.sheetId);
    if (!sheet) return res.status(404).json({ message: "Goal sheet not found." });
 
    if (!sheet.checkInComments) sheet.checkInComments = {};
    sheet.checkInComments[quarter] = comment;
    sheet.markModified('checkInComments');
 
    await sheet.save();
    res.status(200).json({ message: `${quarter} check-in comment saved.`, data: sheet });
  } catch (error) {
    console.error("❌ Manager check-in crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// ── ADMIN ROUTES ───────────────────────────────────────────
 
// 7. Admin — fetch ALL sheets across the system
router.get('/admin/all', async (req, res) => {
  try {
    const sheets = await GoalSheet.find({}).sort({ createdAt: -1 });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("❌ Admin fetch all crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 8. Admin — unlock a sheet (reset Approved → Pending Approval so employee can resubmit)
router.put('/admin/unlock/:sheetId', async (req, res) => {
  try {
    const sheet = await GoalSheet.findByIdAndUpdate(
      req.params.sheetId,
      { status: 'Pending Approval', isLocked: false },
      { new: true }
    );
    if (!sheet) return res.status(404).json({ message: "Sheet not found." });
    res.status(200).json({ message: "Goal sheet unlocked and returned to Pending Approval.", data: sheet });
  } catch (error) {
    console.error("❌ Admin unlock crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 9. Admin — force-approve any sheet
router.put('/admin/force-approve/:sheetId', async (req, res) => {
  try {
    const sheet = await GoalSheet.findByIdAndUpdate(
      req.params.sheetId,
      { status: 'Approved', isLocked: true },
      { new: true }
    );
    if (!sheet) return res.status(404).json({ message: "Sheet not found." });
    res.status(200).json({ message: "Goal sheet force-approved by admin.", data: sheet });
  } catch (error) {
    console.error("❌ Admin force-approve crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
// 10. Admin — hard delete a sheet
router.delete('/admin/delete/:sheetId', async (req, res) => {
  try {
    const sheet = await GoalSheet.findByIdAndDelete(req.params.sheetId);
    if (!sheet) return res.status(404).json({ message: "Sheet not found." });
    res.status(200).json({ message: "Goal sheet permanently deleted." });
  } catch (error) {
    console.error("❌ Admin delete crash:", error);
    res.status(500).json({ message: error.message });
  }
});

// 11. Add audit trail entry to a sheet
router.post('/audit/:sheetId', async (req, res) => {
  try {
    const { actorId, actorName, actorRole, action, details } = req.body;
    const sheet = await GoalSheet.findById(req.params.sheetId);
    if (!sheet) return res.status(404).json({ message: "Sheet not found." });

    if (!sheet.auditTrail) sheet.auditTrail = [];
    sheet.auditTrail.push({ actorId, actorName, actorRole, action, details, timestamp: new Date() });
    sheet.markModified('auditTrail');
    await sheet.save();
    res.status(200).json({ message: "Audit entry logged.", data: sheet.auditTrail });
  } catch (error) {
    console.error("❌ Audit log crash:", error);
    res.status(500).json({ message: error.message });
  }
});

// 12. Get audit trail for a sheet
router.get('/audit/:sheetId', async (req, res) => {
  try {
    const sheet = await GoalSheet.findById(req.params.sheetId);
    if (!sheet) return res.status(404).json({ message: "Sheet not found." });
    res.status(200).json(sheet.auditTrail || []);
  } catch (error) {
    console.error("❌ Audit fetch crash:", error);
    res.status(500).json({ message: error.message });
  }
});
 
module.exports = router;