import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar'; // Ajuster le chemin d'importation si nécessaire

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: number;
  adresse: string;
  photoUrl: string; // Ajouter le champ photoUrl
}

const ClientDetails: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Utiliser useParams pour obtenir l'id

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
      }
    };

    if (id) {
      fetchClient();
    } else {
      console.error('No client ID provided');
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!client) {
    return <p>Chargement...</p>;
  }

  // Définir l'image par défaut
  const defaultPhotoUrl = '/images/utilisateur.png'; // Assurez-vous que le chemin est correct

  return (
    <div className="flex min-h-screen ">
      <SideNavbar />
      <main className="flex-grow p-8 ml-100 bg-white">
        <h1 className="text-3xl font-bold mb-6">Fiche de Client</h1>
        <div className="flex bg-white p-6 rounded-lg">
          <div className="w-1/3 flex justify-center items-center">
            <img
              src={client.photoUrl || defaultPhotoUrl}
              alt={`Photo de ${client.firstname} ${client.lastname}`}
              className="w-48 h-48 object-cover rounded-full border-4 border-gray-300 shadow-lg"
            />
          </div>
          <div className="w-2/3 pl-8 space-y-4">
            <p><strong>Prénom:</strong> {client.firstname}</p>
            <p><strong>Nom:</strong> {client.lastname}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Téléphone:</strong> {client.tel}</p>
            <p><strong>Adresse:</strong> {client.adresse}</p>
            {/* <p><strong>Date de Naissance:</strong> {new Date(client.dateNaissance).toLocaleDateString()}</p> */}
            {/* <p><strong>Animal ID:</strong> {client.animalid}</p> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDetails;
