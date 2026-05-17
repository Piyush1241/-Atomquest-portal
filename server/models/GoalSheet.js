// server/models/GoalSheet.js
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  thrustArea: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  uom: { type: String, enum: ['Numeric', '%', 'Timeline', 'Zero-based'], required: true },
  target: { type: mongoose.Schema.Types.Mixed, required: true },
  actualAchievement: { type: mongoose.Schema.Types.Mixed, default: null },
  weightage: { type: Number, required: true, min: 10 }, // Enforces minimum 10%
  goalStatus: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' }
});

const GoalSheetSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  managerId: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'Returned'], default: 'Draft' },
  isLocked: { type: Boolean, default: false },
  goals: {
    type: [GoalSchema],
    validate: [arrayLimit, 'Max 8 goals allowed.'] // Enforces maximum 8 goals
  },
  checkInComments: {
    Q1: { type: String, default: "" },
    Q2: { type: String, default: "" },
    Q3: { type: String, default: "" },
    Q4: { type: String, default: "" } 
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 8;
}

module.exports = mongoose.model('GoalSheet', GoalSheetSchema);