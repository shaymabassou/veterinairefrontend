'use client';
import ClientDetails from '@/app/components/Client/[id]';
import React from 'react';



const ClientDetailsPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <ClientDetails/>
      </div>
    </div>
  );
};

export default ClientDetailsPage;