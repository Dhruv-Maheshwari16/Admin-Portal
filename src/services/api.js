const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'token';

let logoutCallback = null;

const buildUrl = (path, params) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
};

export const hasApiConfig = () => Boolean(API_BASE_URL);

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('user');
};

export const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    ));
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const { params, body, headers, ...fetchOptions } = options;
  const token = getToken();

  const response = await fetch(buildUrl(path, params), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearToken();
      logoutCallback?.();
    }

    const error = new Error(data?.message || data?.error || response.statusText || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const authAPI = {
  requestEmailOtp: (email) =>
    request('/auth/request-email-otp', {
      method: 'POST',
      body: { email },
    }),
  verifyEmailOtp: (email, otp) =>
    request('/auth/verify-email-otp', {
      method: 'POST',
      body: { email, otp },
    }),
};

export const adminAPI = {
  ...authAPI,

  getAdminBookings: (page, size, date, status) =>
    request('/admin/bookings', {
      params: { page, size, date, status },
    }),
  getServiceBookings: (serviceId, date, page = 0, size = 100) =>
    request(`/admin/services/${serviceId}/bookings`, {
      params: { date, pageNo: page, pageSize: size },
    }),
  getBookingDetails: (bookingId) => request(`/admin/bookings/${bookingId}`),
  getServiceRevenueToday: (serviceId) => request(`/admin/services/${serviceId}/revenue/today`),
  createManualBooking: (data) =>
    request('/admin/booking/manual', {
      method: 'POST',
      body: data,
    }),
  manualBooking: (data) =>
    request('/admin/manual-bookings', {
      method: 'POST',
      body: data,
    }),
  updateBookingStatus: (bookingId, status, reason) =>
    request(`/admin/booking/${bookingId}/status`, {
      method: 'POST',
      body: { status, reason },
    }),
  updateAttendanceStatus: (bookingId, attendanceStatus) =>
    request(`/admin/booking/${bookingId}/attendance`, {
      method: 'POST',
      body: { attendanceStatus },
    }),
  rescheduleBooking: (bookingId, data) =>
    request(`/admin/booking/${bookingId}/reschedule`, {
      method: 'POST',
      body: data,
    }),
  completeBooking: (bookingId, data) =>
    request(`/admin/bookings/${bookingId}/complete`, {
      method: 'PUT',
      body: data,
    }),

  getServices: (page = 0, size = 10) =>
    request('/admin/services', {
      params: { pageNo: page, pageSize: size },
    }),
  getAdminServices: (managerId) => request(`/admin/manager/${managerId}/services`),
  getServiceDetails: (serviceId) => request(`/admin/services/${serviceId}`),
  deleteService: (serviceId) =>
    request(`/admin/service/${serviceId}`, {
      method: 'DELETE',
    }),
  toggleServiceAvailability: (serviceId) =>
    request(`/admin/services/${serviceId}/toggle`, {
      method: 'PATCH',
    }),
  toggleResourceAvailability: (resourceId) =>
    request(`/admin/resources/${resourceId}/toggle`, {
      method: 'PATCH',
    }),
  setServiceAvailable: (serviceId) =>
    request(`/admin/service/${serviceId}/available`, {
      method: 'POST',
    }),
  setServiceNotAvailable: (serviceId) =>
    request(`/admin/service/${serviceId}/not-available`, {
      method: 'POST',
    }),
  getResources: (serviceId) => request(`/admin/services/${serviceId}/resources`),
  getResourceSlots: (resourceId, date) =>
    request(`/admin/resources/${resourceId}/slots`, {
      params: { date },
    }),
  toggleSlotStatus: (resourceId, slotId, date) =>
    request(`/admin/resources/${resourceId}/slots/${slotId}/toggle`, {
      method: 'PATCH',
      params: { date },
    }),

  getServiceSlots: (serviceId) => request(`/admin/service/${serviceId}/slots`),
  getSlotStatus: (serviceId, date) =>
    request(`/admin/service/${serviceId}/slot-status`, {
      params: { date },
    }),
  updateSlotPrice: (serviceId, slotId, price) =>
    request(`/admin/service/${serviceId}/slot/${slotId}/price`, {
      method: 'POST',
      params: { price },
    }),
  enableSlot: (serviceId, slotId) =>
    request(`/admin/service/${serviceId}/slot/${slotId}/enable`, {
      method: 'POST',
    }),
  disableSlot: (serviceId, slotId) =>
    request(`/admin/service/${serviceId}/slot/${slotId}/disable`, {
      method: 'POST',
    }),
  disableSlotForDate: (data) =>
    request('/admin/service/slot/disable-date', {
      method: 'POST',
      body: data,
    }),
  disableSlots: (data) =>
    request('/admin/slots/disable', {
      method: 'POST',
      body: data,
    }),
  getServiceDisabledSlots: (serviceId, date) =>
    request(`/admin/services/${serviceId}/slots/disabled`, {
      params: { date },
    }),
  deleteDisabledSlots: (ids) =>
    request('/admin/slots/disabled', {
      method: 'DELETE',
      body: { disabledSlotIds: ids },
    }),

  updateServiceProfile: (serviceId, data) =>
    request(`/admin/service/${serviceId}/profile`, {
      method: 'PATCH',
      body: data,
    }),
  setServiceApproval: (serviceId, status) =>
    request(`/admin/service/${serviceId}/approval`, {
      method: 'PATCH',
      body: { status },
    }),
  getAnalyticsSummary: () => request('/admin/dashboard/stats'),
  getBookingByReference: (reference) => request(`/admin/bookings/by-reference/${reference}`),
  getUsers: (page, size) =>
    request('/admin/users', {
      params: { page, size },
    }),

  getExpenseCategories: () => request('/api/admin/accounting/expense-categories'),
  createExpenseCategory: (data) =>
    request('/api/admin/accounting/expense-categories', {
      method: 'POST',
      body: data,
    }),
  getExpenseCategoryById: (id) => request(`/api/admin/accounting/expense-categories/${id}`),
  getExpenseCategoriesByType: (type) => request(`/api/admin/accounting/expense-categories/type/${type}`),
  createExpense: (data) =>
    request('/api/admin/accounting/expenses', {
      method: 'POST',
      body: data,
    }),
  addAdminExpense: (data) =>
    request('/admin/expenses', {
      method: 'POST',
      body: data,
    }),
  getExpenses: (serviceId) => request(`/api/admin/accounting/expenses/service/${serviceId}`),
  getFinancialDashboardSummary: (serviceId, params) =>
    request(`/v1/service/financial/${serviceId}/dashboard`, { params }),
  getCashBankSummary: (serviceId) => request(`/v1/service/financial/${serviceId}/cash-bank-summary`),
  getLedgerAccountDetails: (serviceId, params) =>
    request(`/admin/accounting/reports/ledger/service/${serviceId}`, { params }),
  getLedgerCash: (pageNo = 0, pageSize = 20) =>
    request('/admin/ledger/cash', {
      params: { pageNo, pageSize },
    }),
  getLedgerBank: (pageNo = 0, pageSize = 20) =>
    request('/admin/ledger/bank', {
      params: { pageNo, pageSize },
    }),
  getLedgerSummary: () => request('/admin/ledger-summary'),
  getProfitLossReport: (params) => request('/admin/accounting/reports/profit-loss', { params }),
  addManualAdjustment: (serviceId, data) =>
    request(`/api/admin/accounting/adjustments/service/${serviceId}`, {
      method: 'POST',
      body: data,
    }),
  recordAdminAdjustment: (data) =>
    request('/api/admin/accounting/adjustments', {
      method: 'POST',
      body: data,
    }),
  updatePushToken: (token) =>
    request('/admin/push-token', {
      method: 'POST',
      body: { token },
    }),
  deletePushToken: () =>
    request('/admin/push-token', {
      method: 'DELETE',
    }),
};

export const serviceAPI = adminAPI;

export default {
  auth: authAPI,
  admin: adminAPI,
};
