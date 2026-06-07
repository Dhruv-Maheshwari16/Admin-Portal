import { useEffect, useState } from 'react';
import BottomNav from './components/BottomNav';
import DisableSlotsDrawer from './components/DisableSlotsDrawer';

// Import Pages
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import LiveBookings from './pages/LiveBookings';
import Services from './pages/Services';
import VenueDetail from './pages/VenueDetail';
import History from './pages/History';
import Settings from './pages/Settings';
import DisabledSlots from './pages/DisabledSlots';
import ManualBookingWizard from './pages/ManualBookingWizard';
import Ledger from './pages/Ledger';

// Mock Data
import { mockBookings, mockDashboardStats, mockVenues } from './data/mockData';
import { adminAPI, clearToken, decodeJwt, getToken, hasApiConfig, setLogoutCallback, setToken } from './services/api';
import { toBookingList, toDashboardStats, toVenueList } from './services/adapters';

export default function App() {
  const persistedPayload = decodeJwt(getToken() || '');
  const hasPersistedAdmin = persistedPayload?.role === 'ROLE_ADMIN';

  // Authentication Routing state
  const [authStep, setAuthStep] = useState(hasPersistedAdmin ? 'app' : 'login'); // 'login' | 'verify' | 'app'
  const [email, setEmail] = useState(persistedPayload?.sub || '');
  
  // Navigation & Sub-views routing
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'bookings' | 'slots' | 'ledger' | 'profile'
  const [selectedVenue, setSelectedVenue] = useState(null); // Managed venue details sub-page
  const [activeView, setActiveView] = useState('default'); // 'default' | 'disabled_slots' | 'manual_booking' | 'history'

  // Global Interactive Mock States
  const [bookings, setBookings] = useState(mockBookings);
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats);
  const [venues, setVenues] = useState(mockVenues);
  const [isDisableDrawerOpen, setIsDisableDrawerOpen] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(hasPersistedAdmin);
  const [apiNotice, setApiNotice] = useState('');

  async function loadAppData() {
    if (!hasApiConfig()) {
      setApiNotice('VITE_API_BASE_URL is not configured. Showing mock data.');
      return;
    }

    try {
      const [servicesResponse, bookingsResponse, statsResponse] = await Promise.all([
        adminAPI.getServices(0, 50),
        adminAPI.getAdminBookings(0, 100),
        adminAPI.getAnalyticsSummary(),
      ]);

      const nextBookings = toBookingList(bookingsResponse);
      setVenues(toVenueList(servicesResponse));
      setBookings(nextBookings);
      setDashboardStats(toDashboardStats(statsResponse, nextBookings));
      setApiNotice('');
    } catch (err) {
      setApiNotice(err.message || 'Unable to load live data. Showing mock data.');
    }
  }

  function handleLogout() {
    clearToken();
    setEmail('');
    setAuthStep('login');
    setActiveTab('dashboard');
    setSelectedVenue(null);
    setActiveView('default');
  }

  useEffect(() => {
    setLogoutCallback(handleLogout);

    if (hasPersistedAdmin) {
      Promise.resolve()
        .then(loadAppData)
        .finally(() => setIsBootstrapping(false));
    }
  }, [hasPersistedAdmin]);

  // Authentication Callbacks
  const handleEmailSubmit = async (enteredEmail) => {
    if (!hasApiConfig()) {
      throw new Error('Set VITE_API_BASE_URL in .env to use HyperChief APIs.');
    }

    await adminAPI.requestEmailOtp(enteredEmail);
    setEmail(enteredEmail);
    setAuthStep('verify');
  };

  const handleVerifySuccess = async (otp) => {
    const { token } = await adminAPI.verifyEmailOtp(email, otp);
    const payload = decodeJwt(token);
    if (!payload || payload.role !== 'ROLE_ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }

    setToken(token);
    setAuthStep('app');
    await loadAppData();
  };

  const handleResendOtp = (targetEmail) => adminAPI.requestEmailOtp(targetEmail);

  // Add booking from manual wizard
  const handleAddBooking = (newBooking) => {
    // Add to bookings list
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);

    // Update today dashboard metrics if the booking date matches JUN 07, 2026
    if (newBooking.date === '2026-06-07') {
      const isOnline = newBooking.paymentMode === 'ONLINE';
      const priceVal = parseInt(newBooking.price.replace('INR ', '')) || 0;

      setDashboardStats((prev) => ({
        ...prev,
        todayBookings: {
          count: prev.todayBookings.count + 1,
          online: prev.todayBookings.online + (isOnline ? 1 : 0),
          offline: prev.todayBookings.offline + (isOnline ? 0 : 1)
        },
        todayRevenue: {
          count: prev.todayRevenue.count + priceVal,
          online: prev.todayRevenue.online + (isOnline ? priceVal : 0),
          offline: prev.todayRevenue.offline + (isOnline ? 0 : priceVal)
        }
      }));
    }

    setActiveView('default');
    setActiveTab('bookings'); // Redirect to Bookings to see it!
    alert(`Success: Booking ID #${newBooking.id} created manually.`);
  };

  // Handle slot disable submit
  const handleDisableSlots = async (data) => {
    if (!hasApiConfig()) {
      alert(`Success: Disabled slots for ${data.service} on date ${data.startDate} (${data.reason})`);
      return;
    }

    try {
      await adminAPI.disableSlots({
        serviceId: data.serviceId,
        date: data.startDate,
        startDate: data.startDate,
        endDate: data.durationMode === 'range' ? data.endDate : data.startDate,
        reason: data.reason,
      });
      alert(`Success: Disabled slots for ${data.service} on date ${data.startDate} (${data.reason})`);
    } catch (err) {
      alert(err.message || 'Failed to disable slots.');
    }
  };

  // Dashboard quick action trigger router
  const handleDashboardQuickAction = (actionId) => {
    if (actionId === 'disabled_slots') {
      setActiveView('disabled_slots');
    } else if (actionId === 'manual_booking') {
      setActiveView('manual_booking');
    } else if (actionId === 'bulk_disable') {
      setIsDisableDrawerOpen(true);
    } else if (actionId === 'scan_qr') {
      alert('Scanning simulation: Camera activated. Use coupon code HYPER_50.');
    }
  };

  // Core App Views Router
  const renderAppContent = () => {
    // 1. Check if we are inside a sub-page view
    if (activeView === 'disabled_slots') {
      return <DisabledSlots onBack={() => setActiveView('default')} service={selectedVenue || venues[0]} />;
    }
    if (activeView === 'manual_booking') {
      return (
          <ManualBookingWizard 
            onBack={() => setActiveView('default')} 
            onBookingCreated={handleAddBooking} 
            service={selectedVenue || venues[0]}
          />
      );
    }
    if (activeView === 'history') {
      return <History onBack={() => setActiveView('default')} bookingsList={bookings} />;
    }

    // 2. Check if we are inside a venue management detail sub-page
    if (selectedVenue) {
      return (
        <VenueDetail 
          venue={selectedVenue} 
          onBack={() => setSelectedVenue(null)} 
          onOpenDisableDrawer={() => setIsDisableDrawerOpen(true)}
          onOpenManualBooking={() => setActiveView('manual_booking')}
        />
      );
    }

    // 3. Render base tabs
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onQuickAction={handleDashboardQuickAction} 
            stats={dashboardStats} 
          />
        );
      case 'bookings':
        return (
          <LiveBookings 
            onHistoryClick={() => setActiveView('history')} 
            bookingsList={bookings} 
          />
        );
      case 'slots':
        return (
          <Services 
            onManageVenue={(venue) => setSelectedVenue(venue)} 
            venuesList={venues}
          />
        );
      case 'ledger':
        return <Ledger />;
      case 'profile':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Dashboard onQuickAction={handleDashboardQuickAction} stats={dashboardStats} />;
    }
  };

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Loading HyperChief...</p>
      </div>
    );
  }

  // Auth Guard Routing
  if (authStep === 'login') {
    return <Login onEmailSubmit={handleEmailSubmit} />;
  }

  if (authStep === 'verify') {
    return (
      <VerifyOtp 
        email={email} 
        onBack={() => setAuthStep('login')} 
        onVerifySuccess={handleVerifySuccess} 
        onResendOtp={handleResendOtp}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark-bg text-white">
      {/* Sidebar for Desktop, BottomNav for Mobile */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedVenue(null); // Reset detail sub-page on tab switch
          setActiveView('default'); // Reset secondary screens
        }} 
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {apiNotice && (
          <div className="sticky top-0 z-40 bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
            {apiNotice}
          </div>
        )}
        {renderAppContent()}
      </div>

      {/* Bulk Disable modal drawer */}
      <DisableSlotsDrawer 
        isOpen={isDisableDrawerOpen} 
        onClose={() => setIsDisableDrawerOpen(false)} 
        onDisable={handleDisableSlots}
        selectedService={selectedVenue}
      />
    </div>
  );
}
