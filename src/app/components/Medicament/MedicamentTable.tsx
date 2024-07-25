import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import the trash and edit icons

interface Medicament {
  _id: string;
  nom: string;
  type: string;
  quantite: string;
  prixAchat: string;
  dateExpiration: string;
  prixVente: string;
}

interface MedicamentTableProps {
  medicaments: Medicament[];
  handleDeleteMedicament: (id: string) => void;
}

const MedicamentTable: React.FC<MedicamentTableProps> = ({
  medicaments,
  handleDeleteMedicament,
}) => {
  const router = useRouter();

  const handleUpdateMedicament = (id: string) => {
    router.push(`/updatemedicament?id=${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Quantité</th>
            <th className="py-2 px-4 border-b">Prix Achat</th>
            <th className="py-2 px-4 border-b">Prix Vente</th>
            <th className="py-2 px-4 border-b">Date d'Expiration</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((medicament) => (
            <tr key={medicament._id}>
              <td className="py-2 px-4 border-b whitespace-normal">{medicament.nom}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{medicament.type}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{medicament.quantite}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{medicament.prixAchat}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{medicament.prixVente}</td>
              <td className="py-2 px-4 border-b whitespace-normal">{new Date(medicament.dateExpiration).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b whitespace-normal">
                <div className="flex space-x-2">
                  <button
                    className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                    onClick={() => handleUpdateMedicament(medicament._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                    onClick={() => handleDeleteMedicament(medicament._id)}
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

export default MedicamentTable;
