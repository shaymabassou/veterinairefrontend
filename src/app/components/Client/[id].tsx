import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for Next.js 13+
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar'; // Adjust the import path if necessary

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  CIN: string;
  tel: string;
  adresse: string;
  dateNaissance: string;
  animalid: string;
}

const ClientDetails: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Use useParams to get the id

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/users/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClient(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des informations du client : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching client details:', error.response?.data || error.message);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!client) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Détails du Client</h1>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <p><strong>Prénom:</strong> {client.firstname}</p>
          <p><strong>Nom:</strong> {client.lastname}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>CIN:</strong> {client.CIN}</p>
          <p><strong>Téléphone:</strong> {client.tel}</p>
          <p><strong>Adresse:</strong> {client.adresse}</p>
          <p><strong>Date de Naissance:</strong> {new Date(client.dateNaissance).toLocaleDateString()}</p>
          <p><strong>Animal ID:</strong> {client.animalid}</p>
        </div>
      </main>
    </div>
  );
};

export default ClientDetails;
