import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  adresse: string;
  photoUrl: string;
}

interface Animal {
  _id: string;
  numero_de_fiche: string;
  nom: string;
  espece: string;
  race: string;
  age: string;
  sex: string;
  identification: string;
  clientId: Client;
}

interface Historique {
  _id: string;
  dateVisite: string;
  description: string;
}

const AnimalDetails: React.FC = () => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [historiques, setHistoriques] = useState<Historique[]>([]);
  const [showHistorique, setShowHistorique] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAnimalAndHistorique = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const animalResponse = await axios.get(`http://localhost:3000/animals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const historiqueResponse = await axios.get(`http://localhost:3000/animals/${id}/historiques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnimal(animalResponse.data);
        setHistoriques(historiqueResponse.data);
      } catch (error: any) {
        setError(`Échec du chargement des informations de l'animal : ${error.response?.data?.message || error.message}`);
      }
    };

    if (id) {
      fetchAnimalAndHistorique();
    } else {
      console.error('Aucun ID d\'animal fourni');
    }
  }, [id]);

  const toggleHistorique = () => {
    setShowHistorique(!showHistorique);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!animal) {
    return <p>Chargement...</p>;
  }

  const defaultPhotoUrl = '/images/fichier.png';

  return (
    <div className="flex min-h-screen">
      <SideNavbar />
      <main className="flex-grow p-14 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">Fiche d'Animal</h1>
        </div>
        <div className="flex p-6">
          <div className="w-1/3 flex justify-center items-center p-4 rounded-lg">
            <img
              src={animal.clientId.photoUrl || defaultPhotoUrl}
              alt={`Photo de ${animal.clientId.firstname} ${animal.clientId.lastname}`}
              className="object-cover w-32 h-32 "
            />
          </div>
          <div className="w-2/3 pl-10 space-y-6">
            <p><strong>Numéro de fiche:</strong> {animal.numero_de_fiche}</p>
            <p><strong>Nom:</strong> {animal.nom}</p>
            <p><strong>Espèce:</strong> {animal.espece}</p>
            <p><strong>Race:</strong> {animal.race}</p>
            <p><strong>Âge:</strong> {animal.age}</p>
            <p><strong>Sexe:</strong> {animal.sex}</p>
            <p><strong>Identification:</strong> {animal.identification}</p>
            <p><strong>Propriétaire:</strong> {animal.clientId.firstname} {animal.clientId.lastname}</p>
            <p><strong>Email du propriétaire:</strong> {animal.clientId.email}</p>
            <p><strong>Téléphone du propriétaire:</strong> {animal.clientId.tel}</p>
            <p><strong>Adresse du propriétaire:</strong> {animal.clientId.adresse}</p>
          </div>
        </div>
        <div className="flex items-center mb-4 cursor-pointer" onClick={toggleHistorique}>
          <h2 className="text-3xl font-semibold text-gray-700">Historique des visites</h2>
          {showHistorique ? <FaChevronUp className="ml-2 text-gray-700" /> : <FaChevronDown className="ml-2 text-gray-700" />}
        </div>
        {showHistorique && (
          <div className="mt-10">
            {historiques.length > 0 ? (
              <ul className="space-y-4">
                {historiques.map((historique) => (
                  <li key={historique._id} className="p-4 bg-white-100 rounded-lg">
                    <p><strong>Date de Visite:</strong> {new Date(historique.dateVisite).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {historique.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun historique trouvé pour cet animal.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AnimalDetails;
