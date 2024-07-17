import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Medicament {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
}

interface MedicamentCardProps {
  medicament: Medicament;
  onDelete: (id: string) => void; // Fonction callback pour supprimer un médicament
  onUpdate: (id: string) => void; // Fonction callback pour mettre à jour un médicament
}

const MedicamentCard: React.FC<MedicamentCardProps> = ({ medicament, onDelete, onUpdate }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/stock/medicament/${medicament._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(medicament._id);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du médicament:', error.response?.data || error.message);
    }
  };

  const handleUpdate = () => {
    router.push(`/updatemedicament?id=${medicament._id}`);
  };

  return (
    <div className="bg-white p-3 rounded shadow-md rounded-lg p-1/9 bg-opacity-40">
      <h3 className="text-xl font-bold mb-2">{medicament.nom}</h3>
      <p className="text-gray-700">Type: {medicament.type}</p>
      <p className="text-gray-700">Quantité: {medicament.quantite}</p>
      <p className="text-gray-700">Prix d'Achat: {medicament.prixAchat} dt</p>
      <p className="text-gray-700">Date d'Expiration: {new Date(medicament.dateExpiration).toLocaleDateString()}</p>
      <p className="text-gray-700">Prix de Vente: {medicament.prixVente} dt</p>
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mr-5"
          onClick={handleDelete}
        >
          Supprimer
        </button>
        <button
          className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800"
          onClick={handleUpdate}
        >
          Modifier
        </button>
      </div>
    </div>
  );
};

export default MedicamentCard;