import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateProduitAlimentaireForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nom, setNom] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [quantite, setQuantite] = useState<string>('');
  const [prixAchat, setPrixAchat] = useState<string>('');
  const [dateExpiration, setDateExpiration] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduitAlimentaire = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token non trouvé. Veuillez vous reconnecter.');
          return;
        }

        try {
          const response = await axios.get(`http://localhost:3000/stock/produit-alimentaire/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const produitAlimentaire = response.data;
          setNom(produitAlimentaire.nom);
          setType(produitAlimentaire.type);
          setQuantite(produitAlimentaire.quantite);
          setPrixAchat(produitAlimentaire.prixAchat.toString());
          setDateExpiration(produitAlimentaire.dateExpiration);
        } catch (error: any) {
          setError(`Échec du chargement du produit alimentaire : ${error.response?.data?.message || error.message}`);
        }
      };

      fetchProduitAlimentaire();
    }
  }, [id]);

  const calculatePrixVente = (prixAchat: number): number => {
    const pourcentage = 1.2; // Remplacez par votre pourcentage
    return prixAchat * pourcentage;
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
      const prixVente = calculatePrixVente(parseFloat(prixAchat));
      await axios.put(
        `http://localhost:3000/stock/produit-alimentaire/${id}`,
        {
          nom,
          type,
          quantite,
          prixAchat: parseFloat(prixAchat),
          dateExpiration,
          prixVente,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Produit alimentaire mis à jour avec succès');
      router.push('/listeproduitalimentaire');
    } catch (error: any) {
      setError(`Échec de la mise à jour du produit alimentaire : ${error.response?.data?.message || error.message}`);
      console.error('Error updating produit alimentaire:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/produit-alimentaire.jpg')" }}>
        <div className="w-full max-w-lg bg-white bg-opacity-80 p-9 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl mb-6 text-center">Mettre à jour le Produit Alimentaire</h2>
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
                type="text"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-gary-400 text-white py-2 rounded hover:bg-gray-600 transition-colors duration-300"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduitAlimentaireForm;
