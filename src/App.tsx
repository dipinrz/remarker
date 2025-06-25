import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddMember from './components/AddMember';
import AddRemark from './components/AddRemark';
import MemberRemarks from './components/MemberRemarks';
import DateRemarks from './components/DateRemarks';
import AllRemarks from './components/AllRemarks';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-member':
        return <AddMember />;
      case 'add-remark':
        return <AddRemark />;
      case 'member-remarks':
        return <MemberRemarks />;
      case 'date-remarks':
        return <DateRemarks />;
      case 'all-remarks':
        return <AllRemarks />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;