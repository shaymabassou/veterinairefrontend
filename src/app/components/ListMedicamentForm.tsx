import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import MedicamentCard from './MedicamentCard';

interface Medicament {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      await axios.delete(`http://localhost:3000/stock/medicament/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Rafraîchir la liste des médicaments après suppression
      
      fetchMedicaments();
    } catch (error: any) {
      setError(`Erreur lors de la suppression du médicament : ${error.response?.data?.message || error.message}`);
      console.error('Erreur lors de la suppression du médicament :', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("images/medicament.jpg")' }}>
      <h1 className="text-3xl font-bold mb-3 text-center">Liste des Médicaments</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2 font-bold">Rechercher:</label>
          <input
            type="text"
            id="search"
            placeholder="Nom du médicament"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleAddMedicament}
          className="px-4 py-2 bg-red-900 text-white rounded-md shadow-md hover:bg-red-900 focus:outline-none focus:ring-5 focus:ring-blue-500 mt-7 ml-5"
        >
          Ajouter Médicament
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMedicaments.map((medicament) => (
          <MedicamentCard
            key={medicament._id}
            medicament={medicament}
            onDelete={handleDeleteMedicament}
            onUpdate={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ListMedicamentForm;