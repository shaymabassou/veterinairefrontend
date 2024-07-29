'use client';
import AnimalDetails from '@/app/components/Animal/[id]';
import React from 'react';



const AnimalDetailsPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <AnimalDetails/>
      </div>
    </div>
  );
};

export default AnimalDetailsPage;