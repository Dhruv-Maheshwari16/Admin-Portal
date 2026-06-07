import React, { useState } from 'react';
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
import { mockVenues, mockBookings, mockDashboardStats } from './data/mockData';

export default function App() {
  // Authentication Routing state
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'verify' | 'app'
  const [email, setEmail] = useState('');
  
  // Navigation & Sub-views routing
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'bookings' | 'slots' | 'ledger' | 'profile'
  const [selectedVenue, setSelectedVenue] = useState(null); // Managed venue details sub-page
  const [activeView, setActiveView] = useState('default'); // 'default' | 'disabled_slots' | 'manual_booking' | 'history'

  // Global Interactive Mock States
  const [bookings, setBookings] = useState(mockBookings);
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats);
  const [isDisableDrawerOpen, setIsDisableDrawerOpen] = useState(false);

  // Authentication Callbacks
  const handleEmailSubmit = (enteredEmail) => {
    setEmail(enteredEmail);
    setAuthStep('verify');
  };

  const handleVerifySuccess = () => {
    setAuthStep('app');
  };

  const handleLogout = () => {
    setEmail('');
    setAuthStep('login');
    setActiveTab('dashboard');
    setSelectedVenue(null);
    setActiveView('default');
  };

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
  const handleDisableSlots = (data) => {
    alert(`Success: Disabled slots for ${data.service} on date ${data.startDate} (${data.reason})`);
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
      return <DisabledSlots onBack={() => setActiveView('default')} />;
    }
    if (activeView === 'manual_booking') {
      return (
        <ManualBookingWizard 
          onBack={() => setActiveView('default')} 
          onBookingCreated={handleAddBooking} 
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
