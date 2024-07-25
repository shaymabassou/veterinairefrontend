'use client';
import React from 'react';
import SideNavbar from '../components/SideNavbar';
const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <SideNavbar />
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
