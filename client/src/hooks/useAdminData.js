// src/hooks/useAdminData.js
import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_BASE, SG_API_BASE } from '../config/api';

export function useAdminData() {
  const [sheets, setSheets]           = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [filter, setFilter]           = useState('All');
  const [feedback, setFeedback]       = useState('');

  const fetchSheets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/all`);
      setSheets(res.data);
    } catch (err) {
      console.error('Error fetching admin sheets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSharedGoals = useCallback(async () => {
    try {
      const res = await axios.get(`${SG_API_BASE}/all`);
      setSharedGoals(res.data);
    } catch (err) {
      console.error('Error fetching admin shared goals:', err);
    }
  }, []);

  const unlock = async (sheetId) => {
    try {
      await axios.put(`${API_BASE}/admin/unlock/${sheetId}`);
      setFeedback('unlocked');
      await fetchSheets();
    } catch {
      setFeedback('error');
    }
  };

  const forceApprove = async (sheetId) => {
    try {
      await axios.put(`${API_BASE}/admin/force-approve/${sheetId}`);
      setFeedback('approved');
      await fetchSheets();
    } catch {
      setFeedback('error');
    }
  };

  const deleteSheet = async (sheetId) => {
    if (!window.confirm('Permanently delete this sheet? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/admin/delete/${sheetId}`);
      setFeedback('deleted');
      await fetchSheets();
    } catch {
      setFeedback('error');
    }
  };

  const filteredSheets = filter === 'All'
    ? sheets
    : sheets.filter(s => s.status === filter);

  return {
    sheets,
    sharedGoals,
    filteredSheets,
    loading,
    filter,
    feedback,
    setFilter,
    setFeedback,
    fetchSheets,
    fetchSharedGoals,
    unlock,
    forceApprove,
    deleteSheet,
  };
}
