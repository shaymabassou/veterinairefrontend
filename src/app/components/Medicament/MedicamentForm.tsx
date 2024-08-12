import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const MedicamentForm: React.FC = () => {
  const [nom, setNom] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [quantite, setQuantite] = useState<string>('');
  const [unite, setUnite] = useState<string>('mg');
  const [prixAchat, setPrixAchat] = useState<string>('');
  const [margin, setMargin] = useState<string>(''); // User-input margin value
  const [dateExpiration, setDateExpiration] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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
  
      const medicamentData = {
        nom,
        type,
        quantite: `${quantite} ${unite}`,
        prixAchat: prixAchatNum,
        dateExpiration,
        margin: marginNum, // Ensure margin is being sent
        prixVente,
      };
  
      console.log('Medicament Data:', medicamentData);
  
      await axios.post(
        'http://localhost:3000/stock/medicament',
        medicamentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Médicament ajouté avec succès');
      router.push('/listemedicament');
      
    } catch (error: any) {
      setError(`Échec de l'ajout du médicament : ${error.response?.data?.message || error.message}`);
      console.error('Error adding medicament:', error.response?.data || error.message);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      
      <div className="flex-1 flex items-center justify-center bg-cover bg-center">
        <div className="relative w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-6  ml-60">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl mb-6 text-center text-gray-800">Ajouter un Médicament</h2>

            <div className="mb-6">
              <label htmlFor="nom" className="block text-gray-700 mb-2">Nom:</label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="type" className="block text-gray-700 mb-2">Type:</label>
              <input
                id="type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6 flex items-center">
              <label htmlFor="quantite" className="block text-gray-700 mb-2">Quantité:</label>
              <input
                id="quantite"
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                className="w-3/4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                id="unite"
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                required
                className="ml-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniteOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="prixAchat" className="block text-gray-700 mb-2">Prix d'Achat:</label>
              <input
                id="prixAchat"
                type="number"
                value={prixAchat}
                onChange={(e) => setPrixAchat(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="margin" className="block text-gray-700 mb-2">Pourcentage:</label>
              <input
                id="margin"
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 1.2 pour 20% de marge"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="dateExpiration" className="block text-gray-700 mb-2">Date d'Expiration:</label>
              <input
                id="dateExpiration"
                type="date"
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicamentForm;