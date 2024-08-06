import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus } from 'react-icons/fa';
import MedicamentTable from './MedicamentTable';

interface Medicament {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
  margin:string;
}

const ListMedicamentForm: React.FC = () => {
  const router = useRouter();
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMedicaments = medicaments.filter(medicament =>
    medicament.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicament = () => {
    router.push('/addmedicament');
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
        fetchMedicaments(); // Recharger les médicaments après suppression
      } catch (error: any) {
        setError(`Échec de la suppression du médicament : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting medicament:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Liste des Médicaments</h1>
          <button
            className="w-12 h-12 rounded-md border border-gray-300 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center transition duration-200"
            onClick={handleAddMedicament}
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
        <div className="overflow-x-auto bg-white p-4  rounded-lg">
          <MedicamentTable
            medicaments={filteredMedicaments}
            handleDeleteMedicament={handleDeleteMedicament}
          />
        </div>
      </main>
    </div>
  );
};

export default ListMedicamentForm;
