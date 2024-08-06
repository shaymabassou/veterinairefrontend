import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateMedicamentForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nom, setNom] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [quantite, setQuantite] = useState<string>('');
  const [unite, setUnite] = useState<string>('mg');
  const [prixAchat, setPrixAchat] = useState<string>('');
  const [margin, setMargin] = useState<string>(''); // User-input margin value
  const [dateExpiration, setDateExpiration] = useState<string>('');
  const [prixVente, setPrixVente] = useState<string>(''); // For display only
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const uniteOptions = [
    'mg', // milligrammes
    'g',  // grammes
    'ml', // millilitres
    'L',  // litres
    'oz', // onces
    'tablet', // comprimés
    'capsule', // capsules
  ];

  const calculatePrixVente = (prixAchat: number, margin: number): number => {
    return Math.round(prixAchat * margin * 100) / 100; // Rounding to two decimal places
  };

  useEffect(() => {
    if (id) {
      const fetchMedicament = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token non trouvé. Veuillez vous reconnecter.');
          return;
        }

        try {
          const response = await axios.get(`http://localhost:3000/stock/medicament/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const medicament = response.data;

          setNom(medicament.nom || '');
          setType(medicament.type || '');
          setQuantite(medicament.quantite?.split(' ')[0] || '');
          setUnite(medicament.quantite?.split(' ')[1] || 'mg');
          setPrixAchat(medicament.prixAchat?.toString() || '');
          setMargin(medicament.margin?.toString() || ''); // Adding margin field
          // Format the date to YYYY-MM-DD
          const formattedDateExpiration = new Date(medicament.dateExpiration).toISOString().split('T')[0];
          setDateExpiration(formattedDateExpiration);
          setPrixVente(medicament.prixVente?.toString() || '');
        } catch (error: any) {
          setError(`Échec du chargement du médicament : ${error.response?.data?.message || error.message}`);
        }
      };

      fetchMedicament();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const prixAchatNum = parseFloat(prixAchat);
      const marginNum = parseFloat(margin);

      // Ensure margin is greater than 0
      if (marginNum <= 0) {
        setError('La marge doit être supérieure à 0.');
        return;
      }

      const prixVente = calculatePrixVente(prixAchatNum, marginNum);

      await axios.put(
        `http://localhost:3000/stock/medicament/${id}`,
        {
          nom,
          type,
          quantite: `${quantite} ${unite}`,
          prixAchat: prixAchatNum,
          dateExpiration,
          margin: marginNum,
          prixVente,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Médicament mis à jour avec succès');
      router.push('/listemedicament');
    } catch (error: any) {
      setError(`Échec de la mise à jour du médicament : ${error.response?.data?.message || error.message}`);
      console.error('Error updating medicament:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center bg-cover bg-center">
        <div className="w-full max-w-lg bg-white bg-opacity-10 p-9 rounded-lg shadow-lg ml-60">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl mb-6 text-center">Mettre à jour le Médicament</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nom:</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Type:</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 mb-2">Quantité:</label>
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                required
                className="ml-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniteOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Prix d'Achat:</label>
              <input
                type="number"
                value={prixAchat}
                onChange={(e) => setPrixAchat(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Pourcentage:</label>
              <input
                type="text"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 1.2 pour 20% de marge"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date d'Expiration:</label>
              <input
                type="date"
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-50"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMedicamentForm;
