export const mockVenues = [
  {
    id: "house-of-pool",
    name: "The House of Pool",
    address: "Opposite to VIT 1A Gate, 2nd Floor, Katpadi to Thiruvalam Road, Vellore, Tamil Nadu 632007, India",
    status: "LIVE",
    email: "houseofpool27@gmail.com",
    operational: "OPERATIONAL",
    about: "The House of Pool is a multi-sport recreational venue located opposite VIT 1A Gate in Vellore, offering a vibrant space for sports and gaming enthusiasts. The venue features a premium turf for cricket and football, table tennis tables, and dedicated PS5 console gaming sessions. Designed for both casual play and competitive matches, The House of Pool provides a well-maintained, energetic environment for students and sports lovers.",
    amenities: ["Lighting", "Snacks", "Beverages", "AC", "Restroom", "Seating Area"],
    activities: ["Football", "Cricket", "Table Tennis", "Gaming Zone"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
  }
];

export const mockResources = [
  { id: "turf", name: "TURF", price: 1200, icon: "Layers" },
  { id: "ps5", name: "PS5", price: 150, icon: "Layers" },
  { id: "tt1", name: "TT TABLE 1", price: 200, icon: "Layers" },
  { id: "tt2", name: "TT TABLE 2", price: 200, icon: "Layers" }
];

export const mockBookings = [
  {
    id: "9CF1",
    customerName: "MAHESH GOWDA",
    phone: "+919876543210",
    date: "2026-06-07",
    timeSlot: "19:00 - 20:00",
    resourceType: "TURF",
    price: "INR 1200",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "JUN 06, 21:52"
  },
  {
    id: "4BC8",
    customerName: "MAHESH GOWDA",
    phone: "+919876543210",
    date: "2026-06-07",
    timeSlot: "19:00 - 20:00",
    resourceType: "TURF",
    price: "INR 1200",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "JUN 06, 21:51"
  },
  {
    id: "47C7",
    customerName: "PRATIGYA BHANUSHALLI",
    phone: "+919571534246",
    date: "2026-06-02",
    timeSlot: "19:00 - 20:00",
    resourceType: "PS5",
    price: "INR 300",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "JUN 02, 17:56"
  },
  {
    id: "838F",
    customerName: "HITENDRA SINGH",
    phone: "+919490629707",
    date: "2026-04-17",
    timeSlot: "12:00 - 14:00",
    resourceType: "TURF",
    price: "INR 2400",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "APR 17, 11:07"
  },
  {
    id: "33C4",
    customerName: "HITENDRA SINGH",
    phone: "+919490629707",
    date: "2026-04-16",
    timeSlot: "19:00 - 21:00",
    resourceType: "TT TABLE 1",
    price: "INR 400",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "APR 16, 14:12"
  },
  {
    id: "000B",
    customerName: "KIRTHICK HARSHA",
    phone: "+919998887776",
    date: "2026-03-31",
    timeSlot: "09:00 - 10:00",
    resourceType: "TT TABLE 1",
    price: "INR 200",
    paymentMode: "ONLINE",
    status: "EXPIRED",
    timestamp: "MAR 30, 23:37"
  }
];

export const mockDashboardStats = {
  todayBookings: { count: 2, online: 2, offline: 0 },
  monthlyBookings: { count: 34, online: 30, offline: 4 },
  todayRevenue: { count: 2400, online: 2400, offline: 0 },
  monthlyRevenue: { count: 42800, online: 38000, offline: 4800 },
  occupancy: { booked: 84, free: 24 }
};

// Generates time slots for resources
export const getSlotsForResource = (resourceId) => {
  const price = resourceId === "ps5" ? 150 : resourceId === "turf" ? 1200 : 200;
  
  if (resourceId === "tt2") {
    // TT Table 2 has slots from 6:00 AM to 10:00 PM
    return [
      { id: "s1", time: "6:00 AM - 7:00 AM", price },
      { id: "s2", time: "7:00 AM - 8:00 AM", price },
      { id: "s3", time: "8:00 AM - 9:00 AM", price },
      { id: "s4", time: "9:00 AM - 10:00 AM", price },
      { id: "s5", time: "10:00 AM - 11:00 AM", price },
      { id: "s6", time: "11:00 AM - 12:00 PM", price },
      { id: "s7", time: "12:00 PM - 1:00 PM", price },
      { id: "s8", time: "1:00 PM - 2:00 PM", price },
      { id: "s9", time: "2:00 PM - 3:00 PM", price },
      { id: "s10", time: "3:00 PM - 4:00 PM", price },
      { id: "s11", time: "4:00 PM - 5:00 PM", price },
      { id: "s12", time: "5:00 PM - 6:00 PM", price },
      { id: "s13", time: "6:00 PM - 7:00 PM", price },
      { id: "s14", time: "7:00 PM - 8:00 PM", price },
      { id: "s15", time: "8:00 PM - 9:00 PM", price },
      { id: "s16", time: "9:00 PM - 10:00 PM", price }
    ];
  }
  
  // Default slots from 9:00 AM to 9:00 PM
  return [
    { id: "s1", time: "9:00 AM - 10:00 AM", price },
    { id: "s2", time: "10:00 AM - 11:00 AM", price },
    { id: "s3", time: "11:00 AM - 12:00 PM", price },
    { id: "s4", time: "12:00 PM - 1:00 PM", price },
    { id: "s5", time: "1:00 PM - 2:00 PM", price },
    { id: "s6", time: "2:00 PM - 3:00 PM", price },
    { id: "s7", time: "3:00 PM - 4:00 PM", price },
    { id: "s8", time: "4:00 PM - 5:00 PM", price },
    { id: "s9", time: "5:00 PM - 6:00 PM", price },
    { id: "s10", time: "6:00 PM - 7:00 PM", price },
    { id: "s11", time: "7:00 PM - 8:00 PM", price },
    { id: "s12", time: "8:00 PM - 9:00 PM", price }
  ];
};
