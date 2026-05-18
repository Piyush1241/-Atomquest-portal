// src/hooks/useManagerData.js
import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_BASE, SG_API_BASE } from '../config/api';
import { KNOWN_EMPLOYEES } from '../config/constants';

export function useManagerData(managerId) {
  const [sheets, setSheets]                 = useState([]);
  const [sharedGoals, setSharedGoals]       = useState([]);
  const [editingSheets, setEditingSheets]   = useState({});
  const [editModeActive, setEditModeActive] = useState({});
  const [loading, setLoading]               = useState(false);

  const fetchSheets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/manager/${managerId}`);
      setSheets(res.data);
    } catch (err) {
      console.error('Error fetching manager sheets:', err);
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  const fetchSharedGoals = useCallback(async () => {
    try {
      const empIds = KNOWN_EMPLOYEES.map(e => e.id).join(',');
      const res    = await axios.get(`${SG_API_BASE}/team?employeeIds=${empIds}`);
      setSharedGoals(res.data);
    } catch (err) {
      console.error('Error fetching manager shared goals:', err);
    }
  }, []);

  const enterEditMode = (sheet) => {
    setEditingSheets(prev => ({ ...prev, [sheet._id]: sheet.goals.map(g => ({ ...g })) }));
    setEditModeActive(prev => ({ ...prev, [sheet._id]: true }));
  };

  const cancelEditMode = (sheetId) => {
    setEditModeActive(prev => ({ ...prev, [sheetId]: false }));
  };

  const updateEditGoal = (sheetId, goalIndex, field, value) => {
    setEditingSheets(prev => {
      const updated = [...prev[sheetId]];
      updated[goalIndex] = {
        ...updated[goalIndex],
        [field]: field === 'weightage' ? (parseInt(value, 10) || 0) : value,
      };
      return { ...prev, [sheetId]: updated };
    });
  };

  const getEditTotal = (sheetId) =>
    (editingSheets[sheetId] || []).reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);

  return {
    sheets,
    sharedGoals,
    editingSheets,
    editModeActive,
    loading,
    fetchSheets,
    fetchSharedGoals,
    enterEditMode,
    cancelEditMode,
    updateEditGoal,
    getEditTotal,
  };
}
