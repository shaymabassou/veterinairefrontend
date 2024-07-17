import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MedicamentForm: React.FC = () => {
  const [nom, setNom] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [quantite, setQuantite] = useState<string>('');
  const [unite, setUnite] = useState<string>('mg');
  const [prixAchat, setPrixAchat] = useState<string>('');
  const [dateExpiration, setDateExpiration] = useState<string>('');
  const [prixVente, setPrixVente] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Listes de noms et types de médicaments
  const nomOptions = [
    'Penicillin',
    'Trimethoprim-Sulfa',
    'Cephalexin',
    'Enrofloxacin',
    'Carprofen',
    'Deracoxib',
    'Firocoxib',
    'Meloxicam',
    'Opioid Pain Relievers',
    'Oxycodone',
    'Hydromorphone',
    'Butorphanol',
    'Meperidine',
    'Fentanyl',
    'Prednisolone',
    'Dexamethasone',
    'Ivomec (Ivermectin)',
    'Draxxin (Tulathromycin)',
    'Frontline (Fipronil)',
    'Dolpac',
    'Milpro',
    'Nobivac',
    'Eurican',
    'Versican',
  ];

  const typeOptions = [
    'Antibiotics',
    'Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)',
    'Steroids',
    'Antiparasitics',
    'Vaccines',
  ];

  const uniteOptions = [
    'mg', // milligrammes
    'g',  // grammes
    'ml', // millilitres
    'L',  // litres
    'oz', // onces
    'tablet', // comprimés
    'capsule', // capsules
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success message

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/stock/medicament',
        {
          nom,
          type,
          quantite: `${quantite} ${unite}`,
          prixAchat: parseFloat(prixAchat),
          dateExpiration,
          prixVente: parseFloat(prixVente),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Médicament ajouté avec succès');
      // Redirection vers la page listemedicament après le succès
      router.push('/listemedicament');
    } catch (error: any) {
      setError(`Échec de l'ajout du médicament : ${error.response?.data?.message || error.message}`);
      console.error('Error adding medicament:', error.response?.data || error.message);
    }
  };

  return (
<div className="min-h-screen flex items-start justify-start bg-cover bg-center" style={{backgroundImage: "url('/images/medicament.jpg')"}}>
           <div className="absolute w-600 h-6/3 left-40 transform -translate-x-120 -translate-y-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-lg p-1/5">
           <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="text-2xl mb-6 text-center">Ajouter un Médicament</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nom:</label>
          <input
            list="nomOptions"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="nomOptions">
            {nomOptions.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Type:</label>
          <input
            list="typeOptions"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="typeOptions">
            {typeOptions.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 mb-2">Quantité:</label>
          <input
            type="text"
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
            type="text"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prix de Vente:</label>
          <input
            type="text"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
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
          Ajouter
        </button>
      </form>
    </div>
    </div>
  );
};

export default MedicamentForm;