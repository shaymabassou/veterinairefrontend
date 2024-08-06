import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import the trash and edit icons

interface MaterielConsommable {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
  margin: string;
}

interface MaterielConsommableTableProps {
  materielConsommables: MaterielConsommable[];
  handleDeleteMaterielConsommable: (id: string) => void;
}

const MaterielConsommableTable: React.FC<MaterielConsommableTableProps> = ({
  materielConsommables,
  handleDeleteMaterielConsommable,
}) => {
  const router = useRouter();

  const handleUpdate = (id: string) => {
    router.push(`/updatematerielconsommable?id=${id}`);
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
            <th className="py-2 px-4 border border-gray-300">Date d'Expiration</th>
            <th className="py-2 px-4 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materielConsommables.map((materielConsommable) => (
            <tr key={materielConsommable._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.nom}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.type}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.quantite}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.prixAchat}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.margin}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{materielConsommable.prixVente}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">{new Date(materielConsommable.dateExpiration).toLocaleDateString()}</td>
              <td className="py-2 px-4 border border-gray-300 whitespace-normal">
                <div className="flex space-x-2">
                  <button
                    className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                    onClick={() => handleUpdate(materielConsommable._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                    onClick={() => handleDeleteMaterielConsommable(materielConsommable._id)}
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

export default MaterielConsommableTable;
