import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus } from 'react-icons/fa';
import MaterielConsommableTable from './MaterielConsommableTable';

interface MaterielConsommable {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
}

const ListMaterielConsommableForm: React.FC = () => {
  const router = useRouter();
  const [materielConsommables, setMaterielConsommables] = useState<MaterielConsommable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchMaterielConsommables = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/stock/materiel-consommable', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaterielConsommables(response.data);
    } catch (error: any) {
      setError(`Échec du chargement des matériels consommables : ${error.response?.data?.message || error.message}`);
      console.error('Error fetching materiel consommables:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMaterielConsommables();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMaterielConsommables = materielConsommables.filter(materielConsommable =>
    materielConsommable.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterielConsommable = () => {
    router.push('/addmaterielconsommable');
  };

  const handleDeleteMaterielConsommable = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer ce matériel consommable ?')) {
      try {
        await axios.delete(`http://localhost:3000/stock/materiel-consommable/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchMaterielConsommables(); // Recharger les matériels consommables après suppression
      } catch (error: any) {
        setError(`Échec de la suppression du matériel consommable : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting materiel consommable:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Liste des Matériels Consommables</h1>
          <button
            className="relative w-12 h-12 rounded-md border-gray-500 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center"
            onClick={handleAddMaterielConsommable}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
        <div className="relative mb-4 flex items-center w-[375px] h-[48px] shadow-sm">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-3 pl-10 rounded-full flex-grow"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto bg-white p-4  rounded-lg">
          <MaterielConsommableTable
            materielConsommables={filteredMaterielConsommables}
            handleDeleteMaterielConsommable={handleDeleteMaterielConsommable}
          />
        </div>
      </main>
    </div>
  );
};

export default ListMaterielConsommableForm;
