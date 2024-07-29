// pages/ordonnance/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Adjust this import if needed
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar'; // Adjust the import path as needed

interface Ordonnance {
  _id: string;
  nom: string;
  type: string;
  dosage: string;
  nombreDeFoisParJour: number;
  animalId: string; // Assuming animalId is a string
}

const OrdonnanceDetails: React.FC = () => {
  const { id } = useParams(); // Use useParams to get the id
  const [ordonnance, setOrdonnance] = useState<Ordonnance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdonnance = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/ordonnance/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrdonnance(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des informations de l'ordonnance : ${error.response?.data?.message || error.message}`);
      }
    };

    if (id) {
      fetchOrdonnance();
    } else {
      console.error('Aucun ID d\'ordonnance fourni');
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!ordonnance) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex min-h-screen">
      <SideNavbar />
      <main className="flex-grow p-14 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">Détails de l'Ordonnance</h1>
        </div>
        <div className="flex p-6 space-x-6">
          <div className="w-full space-y-6">
            <p><strong>Nom du Médicament:</strong> {ordonnance.nom}</p>
            <p><strong>Type de Médicament:</strong> {ordonnance.type}</p>
            <p><strong>Dosage:</strong> {ordonnance.dosage}</p>
            <p><strong>Nombre de Fois par Jour:</strong> {ordonnance.nombreDeFoisParJour}</p>
            <p><strong>Animal ID:</strong> {ordonnance.animalId}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdonnanceDetails;
