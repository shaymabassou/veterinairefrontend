import React, { useState, useEffect , useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface Animal {
  _id: string;
  numero_de_fiche: string;
  nom: string;
  espece: string;
  race: string;
  age: string;
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
    setCurrentPage(1); 
  };

  const filteredAnimals =  useMemo(() => 
    animals.filter(animal =>
    `${animal.nom} ${animal.espece}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [animals, searchTerm]);

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

  // Pagination state
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage =5;

 // Calculate the total number of pages
 const totalPages = Math.ceil(animals.length / itemsPerPage);

 // Get the current items to display
 const currentItems = useMemo(() => 
  filteredAnimals.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
  ), [filteredAnimals, currentPage]);

 // Handle page change
 const handlePageChange = (page) => {
   setCurrentPage(page);
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
        <div className="bg-white p-1  rounded-lg">
          <table className="w-full border-collapse border border-gray-300 table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Numéro de Fiche</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Nom</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Espèce</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Race</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Âge</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Sexe</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Identification</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Client</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentItems.map((animal) => (
                <tr key={animal._id} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-4 py-2 border border-gray-300">{animal.numero_de_fiche}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.nom}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.espece}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.race}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.age}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.sex}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.identification}</td>
                  <td className="px-4 py-2 border border-gray-300">{animal.clientId ? `${animal.clientId.firstname} ${animal.clientId.lastname}` : 'N/A'}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center border border-blue-500 text-blue-500 px-2 py-1 rounded-md shadow-md hover:bg-blue-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAnimalClick(animal._id);
                        }}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          router.push(`/updateanimal?id=${animal._id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteAnimal(animal._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`px-3 py-1 mx-1 ${
        currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
      } rounded`}
    >
      {index + 1}
    </button>
  ))}
</div>
        </div>
      </main>
    </div>
  );
};

export default ListAnimalForm;
