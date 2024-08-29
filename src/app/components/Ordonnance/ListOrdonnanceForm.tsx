import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface Ordonnance {
  _id: string;
  nom: string;
  type: string;
  dosage: string;
  nombreDeFoisParJour: number;
  animalId: {
    nom: string;
    identification: string;
  } | null;  // Allow animalId to be null if not defined
}

const ListOrdonnanceForm: React.FC = () => {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrdonnances = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/ordonnance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrdonnances(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des ordonnances : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching ordonnances:', error.response?.data || error.message);
      }
    };

    fetchOrdonnances();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Réinitialiser la page lors du changement de recherche
  };

  const filteredOrdonnances = useMemo(() => 
    ordonnances.filter(ordonnance =>
      `${ordonnance.nom} ${ordonnance.type}`.toLowerCase().includes(searchTerm.toLowerCase())
    ), [ordonnances, searchTerm]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredOrdonnances.length / itemsPerPage);

  // Get the current items to display
  const currentItems = useMemo(() => 
    filteredOrdonnances.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ), [filteredOrdonnances, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddOrdonnanceClick = () => {
    router.push('/addordonnance');
  };

  const handleOrdonnanceClick = (id: string) => {
    router.push(`/ordonnance/${id}`);
  };

  const handleDeleteOrdonnance = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer cette ordonnance ?')) {
      try {
        await axios.delete(`http://localhost:3000/ordonnance/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrdonnances(ordonnances.filter(ordonnance => ordonnance._id !== id));
      } catch (error: any) {
        setError(`Échec de la suppression de l'ordonnance : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting ordonnance:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-600">Liste des Ordonnances</h1>
          <button
            className="w-12 h-12 rounded-md border border-gray-300 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center transition duration-200"
            onClick={handleAddOrdonnanceClick}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
        <div className="relative mb-4 flex items-center w-full max-w-md shadow-sm">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou type..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white p-1 rounded-lg">
          <table className="w-full border-collapse border border-gray-300 table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Nom</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Type</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Dosage</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Nombre de Fois par Jour</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Animal</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((ordonnance) => (
                <tr key={ordonnance._id} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-4 py-2 border border-gray-300">{ordonnance.nom}</td>
                  <td className="px-4 py-2 border border-gray-300">{ordonnance.type}</td>
                  <td className="px-4 py-2 border border-gray-300">{ordonnance.dosage}</td>
                  <td className="px-4 py-2 border border-gray-300">{ordonnance.nombreDeFoisParJour}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {ordonnance.animalId ? `${ordonnance.animalId.nom} - ${ordonnance.animalId.identification}` : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex space-x-2"> 
                      <button
                        className="flex items-center border border-blue-500 text-blue-500 px-2 py-1 rounded-md shadow-md hover:bg-blue-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOrdonnanceClick(ordonnance._id);
                        }}
                      > 
                        <FaEye />
                      </button> 
                      <button
                        className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          router.push(`/updateordonnance?id=${ordonnance._id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteOrdonnance(ordonnance._id);
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

export default ListOrdonnanceForm;
