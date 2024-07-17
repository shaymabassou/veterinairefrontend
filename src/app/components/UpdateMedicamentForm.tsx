import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const UpdateMedicamentForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [medicament, setMedicament] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicament = async () => {
      if (!id) {
        setError('Identifiant du médicament non trouvé');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token non trouvé. Veuillez vous reconnecter.');
          return;
        }

        const response = await axios.get(`http://localhost:3000/stock/medicament/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMedicament(response.data);
      } catch (error) {
        setError(`Échec du chargement du médicament : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching medicament:', error.response?.data || error.message);
      }
    };

    if (id) {
      fetchMedicament();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      await axios.put(
        `http://localhost:3000/stock/medicament/${medicament._id}`,
        medicament,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Médicament mis à jour avec succès');
      router.push('/listemedicament');
    } catch (error) {
      setError(`Échec de la mise à jour du médicament : ${error.response?.data?.message || error.message}`);
      console.error('Error updating medicament:', error.response?.data || error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicament({ ...medicament, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("/images/medicament.jpg")' }}>
      <div className="bg-white bg-opacity- p-8 rounded-lg shadow-md">
        <h2 className="text-2xl mb-6 text-center">Mettre à jour le Médicament</h2>
        <form onSubmit={handleUpdate} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nom:</label>
            <input
              type="text"
              name="nom"
              value={medicament.nom || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Type:</label>
            <input
              type="text"
              name="type"
              value={medicament.type || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantité:</label>
            <input
              type="text"
              name="quantite"
              value={medicament.quantite || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Prix d'Achat:</label>
            <input
              type="text"
              name="prixAchat"
              value={medicament.prixAchat || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date d'Expiration:</label>
            <input
              type="date"
              name="dateExpiration"
              value={medicament.dateExpiration || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Prix de Vente:</label>
            <input
              type="text"
              name="prixVente"
              value={medicament.prixVente || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-2 rounded hover:bg-red-900 transition-colors duration-50"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedicamentForm;
