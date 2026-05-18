// src/hooks/useEmployeeData.js
import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_BASE, SG_API_BASE } from '../config/api';

export function useEmployeeData(employeeId) {
  const [approvedSheets, setApprovedSheets]       = useState([]);
  const [achievementInputs, setAchievementInputs] = useState({});
  const [sharedGoals, setSharedGoals]             = useState([]);
  const [loading, setLoading]                     = useState(false);

  const fetchSheets = useCallback(async (id = employeeId) => {
    setLoading(true);
    try {
      const res      = await axios.get(`${API_BASE}/employee/${id}`);
      const approved = res.data.filter(s => s.status === 'Approved');
      setApprovedSheets(approved);

      // Pre-populate achievement inputs from existing DB values
      const inputs = {};
      approved.forEach(sheet => {
        inputs[sheet._id] = {};
        sheet.goals.forEach(g => {
          inputs[sheet._id][g._id] = {
            actual: g.actualAchievement ?? '',
            status: g.goalStatus || 'Not Started',
          };
        });
      });
      setAchievementInputs(inputs);
    } catch (err) {
      console.error('Error fetching employee sheets:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const fetchSharedGoals = useCallback(async (id = employeeId) => {
    try {
      const res = await axios.get(`${SG_API_BASE}/employee/${id}`);
      setSharedGoals(res.data);
    } catch (err) {
      console.error('Error fetching employee shared goals:', err);
    }
  }, [employeeId]);

  const setAchievementInput = (sheetId, goalId, field, value) => {
    setAchievementInputs(prev => ({
      ...prev,
      [sheetId]: {
        ...prev[sheetId],
        [goalId]: { ...prev[sheetId]?.[goalId], [field]: value },
      },
    }));
  };

  return {
    approvedSheets,
    achievementInputs,
    sharedGoals,
    loading,
    fetchSheets,
    fetchSharedGoals,
    setAchievementInput,
  };
}
