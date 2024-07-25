import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus } from 'react-icons/fa';
import ProduitAlimentaireTable from './ProduitAlimentaireTable';

interface ProduitAlimentaire {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  prixVente: string;
}

const ListProduitAlimentaireForm: React.FC = () => {
  const router = useRouter();
  const [produitAlimentaires, setProduitAlimentaires] = useState<ProduitAlimentaire[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProduitAlimentaires = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/stock/produit-alimentaires', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProduitAlimentaires(response.data);
    } catch (error: any) {
      setError(`Échec du chargement des produits alimentaires : ${error.response?.data?.message || error.message}`);
      console.error('Error fetching produit alimentaire:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProduitAlimentaires();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProduitAlimentaires = produitAlimentaires.filter(produitAlimentaire =>
    produitAlimentaire.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduitAlimentaire = () => {
    router.push('/addproduitalimentaire');
  };

  const handleDeleteProduitAlimentaire = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer ce produit alimentaire ?')) {
      try {
        await axios.delete(`http://localhost:3000/stock/produit-alimentaire/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchProduitAlimentaires(); // Recharger les produits alimentaires après suppression
      } catch (error: any) {
        setError(`Échec de la suppression du produit alimentaire : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting produit alimentaire:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Liste des Produits Alimentaires</h1>
          <button
            className="relative w-12 h-12 rounded-md border-gray-500 text-gray-500 shadow-md hover:bg-gray-600 flex items-center justify-center"
            onClick={handleAddProduitAlimentaire}
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
        <div className="overflow-x-auto">
          <ProduitAlimentaireTable
            produitAlimentaires={filteredProduitAlimentaires}
            handleDeleteProduitAlimentaire={handleDeleteProduitAlimentaire}
          />
        </div>
      </main>
    </div>
  );
};

export default ListProduitAlimentaireForm;
