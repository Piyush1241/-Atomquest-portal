// src/config/constants.js
// All static lookup data in one place.

export const USERS = [
  { id: 'EMP101',  password: 'emp123',   role: 'Employee', name: 'Piyush',         label: 'Employee Environment',   icon: '💼' },
  { id: 'EMP102',  password: 'emp234',   role: 'Employee', name: 'Surya',          label: 'Employee Environment',   icon: '💼' },
  { id: 'EMP103',  password: 'emp345',   role: 'Employee', name: 'Ravit',          label: 'Employee Environment',   icon: '💼' },
  { id: 'MGR555',  password: 'mgr123',   role: 'Manager',  name: 'Sarah Mitchell', label: 'Executive L1 Dashboard', icon: '🛡️' },
  { id: 'ADMIN01', password: 'admin123', role: 'Admin',    name: 'System Admin',   label: 'System Administrator',   icon: '⚙️' },
];

export const KNOWN_EMPLOYEES = [
  { id: 'EMP101', name: 'Piyush' },
  { id: 'EMP102', name: 'Surya' },
  { id: 'EMP103', name: 'Ravit' },
];

export const UOM_OPTIONS = [
  { value: '%',           label: '% (Higher is better)' },
  { value: '%-max',       label: '% (Lower is better)' },
  { value: 'Numeric',     label: 'Numeric (Higher is better)' },
  { value: 'Numeric-max', label: 'Numeric (Lower is better)' },
  { value: 'Timeline',    label: 'Timeline / Date' },
  { value: 'Zero-based',  label: 'Binary (0/1)' },
];

export const STATUS_OPTIONS = ['Not Started', 'On Track', 'Completed'];

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export const BLANK_GOAL = {
  thrustArea: '', title: '', description: '', uom: '%', target: '', weightage: 10,
};
