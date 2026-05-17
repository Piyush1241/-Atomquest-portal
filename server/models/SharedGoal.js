// server/models/SharedGoal.js
const mongoose = require('mongoose');

const SharedGoalAssignmentSchema = new mongoose.Schema({
  employeeId:   { type: String, required: true },
  employeeName: { type: String, required: true },
  actualAchievement: { type: mongoose.Schema.Types.Mixed, default: null },
  goalStatus: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  lastUpdated: { type: Date, default: null }
});

const SharedGoalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  thrustArea:  { type: String, required: true },
  uom:         { type: String, enum: ['Numeric', '%', 'Numeric-max', '%-max', 'Timeline', 'Zero-based'], required: true },
  target:      { type: mongoose.Schema.Types.Mixed, required: true },
  cycleYear:   { type: String, required: true },
  createdBy:   { type: String, required: true },   // admin actorId
  createdByName: { type: String, required: true },
  assignments: [SharedGoalAssignmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('SharedGoal', SharedGoalSchema);
