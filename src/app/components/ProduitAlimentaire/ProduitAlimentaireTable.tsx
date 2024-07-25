import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import the trash and edit icons

interface ProduitAlimentaire {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  prixVente: string;
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
      <table className="min-w-full bg-white border border-gray-300 table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Quantité</th>
            <th className="py-2 px-4 border-b">Prix d'Achat</th>
            <th className="py-2 px-4 border-b">Prix de Vente</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {produitAlimentaires.map((produitAlimentaire) => (
            <tr key={produitAlimentaire._id}>
              <td className="py-2 px-4 border-b whitespace-normal">{produitAlimentaire.nom}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{produitAlimentaire.type}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{produitAlimentaire.quantite}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{produitAlimentaire.prixAchat}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{produitAlimentaire.prixVente}</td>
              <td className="py-2 px-4 border-b whitespace-normal">
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
