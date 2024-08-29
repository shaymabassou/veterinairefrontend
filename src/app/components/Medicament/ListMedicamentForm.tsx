import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Medicament {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: number;
  dateExpiration: string;
  margin: number;
  prixVente: number;
}

const ListeMedicamentForm: React.FC = () => {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMedicaments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/stock/medicaments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMedicaments(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des médicaments : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching medicaments:', error.response?.data || error.message);
      }
    };

    fetchMedicaments();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(medicaments.length / itemsPerPage);


  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Réinitialiser la page lors du changement de recherche
  };
  

  const filteredMedicaments = useMemo(() => 
    medicaments.filter(medicament =>
      `${medicament.nom} ${medicament.type}`.toLowerCase().includes(searchTerm.toLowerCase())
    ), [medicaments, searchTerm]);

    const currentItems = useMemo(() => 
      filteredMedicaments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ), [filteredMedicaments, currentPage]);

  const formatPrixVente = (prixVente: string): string => {
    const prix = parseFloat(prixVente);
    return prix.toFixed(2);
  };


  const handleAddMedicamentClick = () => {
    router.push('/addmedicament');
  };

  const handleUpdateMedicament = (id: string) => {
    router.push(`/updatemedicament?id=${id}`);
  };

  const handleDeleteMedicament = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer ce médicament ?')) {
      try {
        await axios.delete(`http://localhost:3000/stock/medicament/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMedicaments(medicaments.filter(medicament => medicament._id !== id));
      } catch (error: any) {
        setError(`Échec de la suppression du médicament : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting medicament:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-4 ml-64 bg-white overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-600">Liste des Médicaments</h1>
          <button
            className="w-12 h-12 rounded-md border border-gray-300 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center transition duration-200"
            onClick={handleAddMedicamentClick}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
        <div className="relative mb-4 flex items-center w-full max-w-md shadow-sm">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto bg-white p-4 rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 table-fixed">
            <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
            <th className="py-2 px-4 border border-gray-300 text-left">Nom</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Type</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Quantité</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Prix Achat</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Pourcentage</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Prix Vente</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Date d'Expiration</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Actions</th>
          </tr>
            </thead>
            <tbody>
            {currentItems.map((medicament) => (
                <tr key={medicament._id} className="hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                    <td className="py-2 px-4 border border-gray-300">{medicament.nom}</td>
              <td className="py-2 px-4 border border-gray-300">{medicament.type}</td>
              <td className="py-2 px-4 border border-gray-300">{medicament.quantite}</td>
              <td className="py-2 px-4 border border-gray-300">{medicament.prixAchat}</td>
              <td className="py-2 px-4 border border-gray-300">{medicament.margin}</td>
              <td className="py-2 px-4 border border-gray-300">{formatPrixVente(medicament.prixVente)}</td>
              <td className="py-2 px-4 border border-gray-300">{new Date(medicament.dateExpiration).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex
                  space-x-2">
                     <button
                    className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                    onClick={() => handleUpdateMedicament(medicament._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                    onClick={() => handleDeleteMedicament(medicament._id)}
                  >
                    <FaTrash />
                  </button>
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

export default ListeMedicamentForm;


