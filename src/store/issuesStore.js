import { create } from 'zustand';
import { issuesAPI } from '../api';

const useIssuesStore = create((set, get) => ({
  issues: [],
  stats: { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0, total: 0 },
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
    severity: '',
    sort: 'created_at',
    order: 'DESC',
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetchIssues: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const res = await issuesAPI.list({ ...filters, page, limit: get().pagination.limit });
      set({ issues: res.data.issues, pagination: res.data.pagination, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch issues', loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await issuesAPI.stats();
      set({ stats: res.data });
    } catch {}
  },

  createIssue: async (data) => {
    const res = await issuesAPI.create(data);
    get().fetchIssues(1);
    get().fetchStats();
    return res.data.issue;
  },

  updateIssue: async (id, data) => {
    const res = await issuesAPI.update(id, data);
    get().fetchIssues(get().pagination.page);
    get().fetchStats();
    return res.data.issue;
  },

  deleteIssue: async (id) => {
    await issuesAPI.delete(id);
    get().fetchIssues(get().pagination.page);
    get().fetchStats();
  },

  exportIssues: async (format) => {
    const res = await issuesAPI.export(format);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `issues.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  },
}));

export default useIssuesStore;
