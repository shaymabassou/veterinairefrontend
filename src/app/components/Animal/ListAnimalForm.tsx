import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaHistory } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';

interface Animal {
  _id: string;
  numero_de_fiche: string;
  nom_prioritaire: string;
  espece: string;
  race: string;
  age: number;
  sex: string;
  identification: string;
  clientId: { firstname: string; lastname: string } | null;
}

const ListAnimalForm: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnimals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/animals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimals(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des animaux : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching animals:', error.response?.data || error.message);
      }
    };

    fetchAnimals();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAnimals = animals.filter(animal =>
    `${animal.nom_prioritaire} ${animal.espece}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAnimalClick = () => {
    router.push('/addanimal');
  };

  const handleAnimalClick = (animalId: string) => {
    router.push(`/animals/${animalId}`);
  };

  const handleDeleteAnimal = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer cet animal ?')) {
      try {
        await axios.delete(`http://localhost:3000/animals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimals(animals.filter(animal => animal._id !== id));
      } catch (error: any) {
        setError(`Échec de la suppression de l'animal : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting animal:', error.response?.data || error.message);
      }
    }
  };

  const handleHistoryClick = (animalId: string) => {
    router.push(`/animals/${animalId}/history`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-600">Liste des Animaux</h1>
          <button
            className="w-12 h-12 rounded-md border border-gray-300 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center transition duration-200"
            onClick={handleAddAnimalClick}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
        <div className="relative mb-4 flex items-center w-full max-w-md shadow-sm">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou espèce..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full bg-white border table-fixed">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Numéro de Fiche</th>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Espèce</th>
                <th className="px-4 py-2">Race</th>
                <th className="px-4 py-2">Âge</th>
                <th className="px-4 py-2">Sexe</th>
                <th className="px-4 py-2">Identification</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Historique</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimals.map((animal) => (
                <tr key={animal._id} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-4 py-2" onClick={() => handleAnimalClick(animal._id)}>
                    {animal.numero_de_fiche}
                  </td>
                  <td className="px-4 py-2" onClick={() => handleAnimalClick(animal._id)}>
                    {animal.nom_prioritaire}
                  </td>
                  <td className="px-4 py-2" onClick={() => handleAnimalClick(animal._id)}>
                    {animal.espece}
                  </td>
                  <td className="px-4 py-2" onClick={() => handleAnimalClick(animal._id)}>
                    {animal.race}
                  </td>
                  <td className="px-4 py-2">{animal.age}</td>
                  <td className="px-4 py-2">{animal.sex}</td>
                  <td className="px-4 py-2">{animal.identification}</td>
                  <td className="px-4 py-2">{animal.clientId ? `${animal.clientId.firstname} ${animal.clientId.lastname}` : 'N/A'}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleHistoryClick(animal._id);
                      }}
                    >
                      <FaHistory />
                    </button>
                  </td>
                  <td className="px-4 py-2 flex justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/updateanimal?id=${animal._id}`);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteAnimal(animal._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ListAnimalForm;
