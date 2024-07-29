import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar'; // Adjust the import path as needed

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  CIN: string;
  tel: string;
  adresse: string;
  dateNaissance: string;
  photoUrl: string; // Add photoUrl field
}

interface Animal {
  _id: string;
  numero_de_fiche: string;
  nom_prioritaire: string;
  espece: string;
  race: string;
  age: string;
  sex: string;
  identification: string;
  clientId: Client; // Assuming clientId is populated with Client details
}

const AnimalDetails: React.FC = () => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Use useParams to get the id

  useEffect(() => {
    const fetchAnimal = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/animals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimal(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des informations de l'animal : ${error.response?.data?.message || error.message}`);
      }
    };

    if (id) {
      fetchAnimal();
    } else {
      console.error('No animal ID provided');
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!animal) {
    return <p>Chargement...</p>;
  }

  // Define the default photo URL for the animal's owner (client)
  const defaultPhotoUrl = '/images/fichier.png'; // Ensure the path is correct

  return (
    <div className="flex min-h-screen">
      <SideNavbar />
      <main className="flex-grow p-14 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">Fiche d'Animal</h1>
        </div>
        <div className="flex p-6 ">
          <div className="w-1/3 flex justify-center items-center  p-4 rounded-lg">
            <img
              src={animal.clientId.photoUrl || defaultPhotoUrl}
              alt={`Photo de ${animal.clientId.firstname} ${animal.clientId.lastname}`}
             
            />
          </div>
          <div className="w-2/3 pl-10 space-y-6">
            <p><strong>Numéro de fiche:</strong> {animal.numero_de_fiche}</p>
            <p><strong>Nom prioritaire:</strong> {animal.nom_prioritaire}</p>
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
      </main>
    </div>
  );
};

export default AnimalDetails;
