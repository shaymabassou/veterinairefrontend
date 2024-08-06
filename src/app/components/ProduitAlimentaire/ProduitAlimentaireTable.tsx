import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface ProduitAlimentaire {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
  margin: string;
}

interface ProduitAlimentaireTableProps {
  produitAlimentaires: ProduitAlimentaire[];
  handleDeleteProduitAlimentaire: (id: string) => void;
}

const ProduitAlimentaireTable: React.FC<ProduitAlimentaireTableProps> = ({
  produitAlimentaires,
  handleDeleteProduitAlimentaire,
}) => {
  const router = useRouter();

  const handleUpdateProduitAlimentaire = (id: string) => {
    router.push(`/updateproduitalimentaire?id=${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border border-gray-300">Nom</th>
            <th className="py-2 px-4 border border-gray-300">Type</th>
            <th className="py-2 px-4 border border-gray-300">Quantité</th>
            <th className="py-2 px-4 border border-gray-300">Prix d'Achat</th>
            <th className="py-2 px-4 border border-gray-300">Pourcentage</th>
            <th className="py-2 px-4 border border-gray-300">Prix de Vente</th>
            <th className="py-2 px-4 border border-gray-300 text-left">Date d'Expiration</th>
            <th className="py-2 px-4 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {produitAlimentaires.map((produitAlimentaire) => (
            <tr key={produitAlimentaire._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.nom}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.type}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.quantite}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.prixAchat}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.margin}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{produitAlimentaire.prixVente}</td>
              <td className="py-2 px-4 border border-gray-300">{new Date(produitAlimentaire.dateExpiration).toLocaleDateString()}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">
                <div className="flex space-x-2">
                  <button
                    className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                    onClick={() => handleUpdateProduitAlimentaire(produitAlimentaire._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                    onClick={() => handleDeleteProduitAlimentaire(produitAlimentaire._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProduitAlimentaireTable;
