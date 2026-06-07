import { mockDashboardStats } from '../data/mockData';

const defaultImage = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';

const unwrapList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const amountFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null && item !== '');
  const numeric = typeof value === 'string' ? Number(value.replace(/[^0-9.]/g, '')) : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatDateStamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).toUpperCase();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
};

const formatTimestamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).toUpperCase();
  return `${date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

export const toVenueList = (response) =>
  unwrapList(response).map((service) => ({
    ...service,
    id: service.id,
    name: service.name || service.serviceName || 'Unnamed Service',
    address: service.address || [service.location, service.city, service.state].filter(Boolean).join(', ') || 'Address unavailable',
    status: service.availability === false ? 'PAUSED' : 'LIVE',
    email: service.email || service.contactEmail || '',
    operational: service.availability === false ? 'NOT OPERATIONAL' : 'OPERATIONAL',
    about: service.description || service.about || 'No description provided for this service.',
    amenities: service.amenities || [],
    activities: service.sports || service.activities || [],
    image: service.image || service.coverImage || service.photos?.[0] || defaultImage,
    backend: service,
  }));

export const toResourceList = (response) =>
  unwrapList(response).map((resource) => ({
    ...resource,
    id: resource.id,
    name: resource.name || resource.resourceName || resource.activityCode || 'RESOURCE',
    price: amountFrom(resource.price, resource.pricePerHour, resource.amount),
    activityCode: resource.activityCode || resource.sportCode || resource.code || resource.name || 'MANUAL',
    backend: resource,
  }));

export const toSlotList = (response, fallbackPrice = 0) =>
  unwrapList(response).map((slot) => {
    const startTime = slot.startTime || slot.start || slot.from;
    const endTime = slot.endTime || slot.end || slot.to;
    return {
      ...slot,
      id: slot.id,
      time: slot.time || [startTime, endTime].filter(Boolean).join(' - '),
      startTime,
      endTime,
      price: amountFrom(slot.price, slot.amount, fallbackPrice),
      disabled: slot.available === false || slot.disabled === true,
      backend: slot,
    };
  });

export const toBookingList = (response) =>
  unwrapList(response).map((booking) => {
    const amount = amountFrom(
      booking.amount,
      booking.totalAmount,
      booking.price,
      booking.paymentBreakdown?.totalAmount
    );
    const date = booking.bookingDate || booking.date;
    const startTime = booking.startTime || booking.slotStartTime;
    const endTime = booking.endTime || booking.slotEndTime;

    return {
      ...booking,
      id: booking.reference || booking.bookingReference || booking.id,
      customerName: (booking.customerName || booking.userName || booking.name || 'Guest').toUpperCase(),
      phone: booking.phone || booking.customerPhone || booking.userPhone || '',
      date,
      timeSlot: booking.timeSlot || [startTime, endTime].filter(Boolean).join(' - '),
      resourceType: booking.resourceName || booking.resourceType || booking.serviceName || booking.activityCode || 'SERVICE',
      price: `INR ${amount}`,
      paymentMode: booking.paymentMode || booking.collectionMethod || booking.paymentType || 'ONLINE',
      status: booking.status || booking.bookingStatus || 'CONFIRMED',
      timestamp: formatTimestamp(booking.createdAt || booking.createdDate || booking.updatedAt),
      backend: booking,
    };
  });

export const toDashboardStats = (response, bookings = []) => {
  if (!response) return mockDashboardStats;

  return {
    todayBookings: {
      count: amountFrom(response.todayBookings, response.bookingsToday, response.totalBookingsToday, bookings.length),
      online: amountFrom(response.todayOnlineBookings, response.onlineBookingsToday),
      offline: amountFrom(response.todayOfflineBookings, response.offlineBookingsToday),
    },
    monthlyBookings: {
      count: amountFrom(response.monthlyBookings, response.bookingsThisMonth, response.totalBookingsThisMonth),
      online: amountFrom(response.monthlyOnlineBookings, response.onlineBookingsThisMonth),
      offline: amountFrom(response.monthlyOfflineBookings, response.offlineBookingsThisMonth),
    },
    todayRevenue: {
      count: amountFrom(response.todayRevenue, response.revenueToday, response.totalRevenueToday),
      online: amountFrom(response.todayOnlineRevenue, response.onlineRevenueToday),
      offline: amountFrom(response.todayOfflineRevenue, response.offlineRevenueToday),
    },
    monthlyRevenue: {
      count: amountFrom(response.monthlyRevenue, response.revenueThisMonth, response.totalRevenueThisMonth),
      online: amountFrom(response.monthlyOnlineRevenue, response.onlineRevenueThisMonth),
      offline: amountFrom(response.monthlyOfflineRevenue, response.offlineRevenueThisMonth),
    },
    occupancy: {
      booked: amountFrom(response.occupancy?.booked, response.bookedSlots, mockDashboardStats.occupancy.booked),
      free: amountFrom(response.occupancy?.free, response.freeSlots, mockDashboardStats.occupancy.free),
    },
  };
};

export const toDisabledSlots = (response) =>
  unwrapList(response).map((slot) => ({
    id: slot.id,
    time: slot.time || [slot.startTime, slot.endTime].filter(Boolean).join(' - '),
    resource: slot.resourceName || slot.resource?.name || 'RESOURCE',
    reason: slot.reason || 'DISABLED',
    date: slot.date || slot.disabledDate,
    backend: slot,
  }));

export const displayDate = formatDateStamp;
