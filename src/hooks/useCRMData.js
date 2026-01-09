import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for fetching and managing leads from Supabase
 * @returns {Object} - { leads, loading, error, refetch }
 */
export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
};

/**
 * Custom hook for fetching a single lead by ID
 * @param {string} leadId - The ID of the lead to fetch
 * @returns {Object} - { lead, loading, error, refetch }
 */
export const useLead = (leadId) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLead = useCallback(async () => {
    if (!leadId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError) throw fetchError;

      setLead(data);
    } catch (err) {
      console.error('Error fetching lead:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  return { lead, loading, error, refetch: fetchLead };
};

/**
 * Custom hook for updating lead stage in the pipeline
 * @returns {Object} - { updateStage, loading, error }
 */
export const useUpdateLeadStage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStage = useCallback(async (leadId, newStage) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          stage: newStage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (err) {
      console.error('Error updating lead stage:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStage, loading, error };
};

/**
 * Custom hook for logging interactions (calls, emails, meetings, notes)
 * @returns {Object} - { logInteraction, loading, error }
 */
export const useLogInteraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logInteraction = useCallback(async (leadId, interactionData) => {
    try {
      setLoading(true);
      setError(null);

      const {
        type, // 'call', 'email', 'meeting', 'note'
        subject,
        description,
        duration, // in minutes, optional
        outcome, // optional
      } = interactionData;

      // Validate required fields
      if (!leadId || !type || !description) {
        throw new Error('Missing required fields: leadId, type, and description');
      }

      const interactionRecord = {
        lead_id: leadId,
        type,
        subject: subject || null,
        description,
        duration: duration || null,
        outcome: outcome || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from('interactions')
        .insert([interactionRecord])
        .select();

      if (insertError) throw insertError;

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error logging interaction:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { logInteraction, loading, error };
};

/**
 * Custom hook for fetching interactions for a specific lead
 * @param {string} leadId - The ID of the lead
 * @returns {Object} - { interactions, loading, error, refetch }
 */
export const useLeadInteractions = (leadId) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInteractions = useCallback(async () => {
    if (!leadId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setInteractions(data || []);
    } catch (err) {
      console.error('Error fetching interactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return { interactions, loading, error, refetch: fetchInteractions };
};

/**
 * Custom hook for filtering leads by various criteria
 * @param {Object} filters - Filter criteria { stage, priority, source, search }
 * @returns {Object} - { filteredLeads, loading, error, refetch }
 */
export const useFilteredLeads = (filters = {}) => {
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilteredLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('leads').select('*');

      // Apply filters
      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, error: fetchError } = await query.order('created_at', {
        ascending: false,
      });

      if (fetchError) throw fetchError;

      setFilteredLeads(data || []);
    } catch (err) {
      console.error('Error fetching filtered leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.stage, filters.priority, filters.source, filters.search]);

  useEffect(() => {
    fetchFilteredLeads();
  }, [fetchFilteredLeads]);

  return { filteredLeads, loading, error, refetch: fetchFilteredLeads };
};

/**
 * Custom hook for updating lead information
 * @returns {Object} - { updateLead, loading, error }
 */
export const useUpdateLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLead = useCallback(async (leadId, leadData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          ...leadData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateLead, loading, error };
};

/**
 * Custom hook for getting lead statistics
 * @returns {Object} - { stats, loading, error, refetch }
 */
export const useLeadStats = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    byStage: {},
    byPriority: {},
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('id, stage, priority, created_at');

      if (fetchError) throw fetchError;

      const leads = data || [];
      const byStage = {};
      const byPriority = {};
      const now = new Date();
      const thisMonth = leads.filter((lead) => {
        const createdDate = new Date(lead.created_at);
        return (
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      }).length;

      leads.forEach((lead) => {
        byStage[lead.stage] = (byStage[lead.stage] || 0) + 1;
        byPriority[lead.priority] = (byPriority[lead.priority] || 0) + 1;
      });

      setStats({
        totalLeads: leads.length,
        byStage,
        byPriority,
        thisMonth,
      });
    } catch (err) {
      console.error('Error fetching lead stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};
