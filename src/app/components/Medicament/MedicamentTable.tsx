// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { FaTrash, FaEdit } from 'react-icons/fa'; // Import the trash and edit icons

// interface Medicament {
//   _id: string;
//   nom: string;
//   type: string;
//   quantite: string;
//   prixAchat: string;
//   dateExpiration: string;
//   prixVente: string;
//   margin: string;
// }

// interface MedicamentTableProps {
//   medicaments: Medicament[];
//   handleDeleteMedicament: (id: string) => void;
// }

// const MedicamentTable: React.FC<MedicamentTableProps> = ({
//   medicaments,
//   handleDeleteMedicament,
// }) => {
//   const router = useRouter();

//   const handleUpdateMedicament = (id: string) => {
//     router.push(`/updatemedicament?id=${id}`);
//   };

//   const formatPrixVente = (prixVente: string): string => {
//     const prix = parseFloat(prixVente);
//     return prix.toFixed(2);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border-collapse">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="py-2 px-4 border border-gray-300 text-left">Nom</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Type</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Quantité</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Prix Achat</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Pourcentage</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Prix Vente</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Date d'Expiration</th>
//             <th className="py-2 px-4 border border-gray-300 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {medicaments.map((medicament) => (
//             <tr key={medicament._id} className="hover:bg-gray-50">
//               <td className="py-2 px-4 border border-gray-300">{medicament.nom}</td>
//               <td className="py-2 px-4 border border-gray-300">{medicament.type}</td>
//               <td className="py-2 px-4 border border-gray-300">{medicament.quantite}</td>
//               <td className="py-2 px-4 border border-gray-300">{medicament.prixAchat}</td>
//               <td className="py-2 px-4 border border-gray-300">{medicament.margin}</td>
//               <td className="py-2 px-4 border border-gray-300">{formatPrixVente(medicament.prixVente)}</td>
//               <td className="py-2 px-4 border border-gray-300">{new Date(medicament.dateExpiration).toLocaleDateString()}</td>
//               <td className="py-2 px-4 border border-gray-300">
//                 <div className="flex space-x-2">
//                   <button
//                     className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
//                     onClick={() => handleUpdateMedicament(medicament._id)}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
//                     onClick={() => handleDeleteMedicament(medicament._id)}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MedicamentTable;
