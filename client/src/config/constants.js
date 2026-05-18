// src/config/constants.js
// All static lookup data in one place.
// Note: users are now stored in PostgreSQL — see server/db/seed.js

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
