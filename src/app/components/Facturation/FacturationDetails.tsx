import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  tel: string;
  adresse: string;
}

interface Medecin {
  name: string;
  adresse: string;
  tel: string;
}

interface Facturation {
  _id: string;
  facture_n: string;
  date: string;
  clientId: Client;
  prixConsultation: number;
  prixGlobale: number;
  medicament?: {
    medicamentId:string;
    nom: string;
    prixVente: number;
  };
  produitalimentaire?: {
    nom: string;
    prixVente: number;
  };
  materielconsommable?: {
    nom: string;
    prixVente: number;
  };
}

const DetailsFacturation: React.FC = () => {
  const [facturation, setFacturation] = useState<Facturation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams(); // Get the facturation ID from the URL

  // Default doctor details
  const defaultMedecin: Medecin = {
    name: 'Dr. veterinaire',
    adresse: '123 Rue de la Santé, Sousse',
    tel: '+216 52 675 987',
  };

  useEffect(() => {
    const fetchFacturation = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/facturation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFacturation(response.data); // Assuming `id` fetches a single facturation
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    if (id) fetchFacturation();
  }, [id]);

  const handleEditFacturation = (id: string) => {
    console.log(`Edit facturation ${id}`);
    router.push(`/edit-facturation/${id}`);
  };

  const handleDeleteFacturation = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/facturation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Facturation supprimée avec succès.');
      setFacturation(null);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de la suppression de la facturation. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white-100 ml-60">
        <div className="w-full p-10">
          {/* <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Détails de la Facturation</h2> */}
          {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
          {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
          {facturation && (
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-10">
              <h2 className="text-3xl font-bold mb-20 text-blue-900">FACTURE 2024-XX</h2>
             
              
              <div className="mb-10 grid grid-cols-2 gap-10">
                <div>
                {/* <h3 className="font-semibold text-gray-700">Numéro_Facture: {facturation.facture_n}</h3> */}
                  <h3 className="font-semibold text-gray-700">Adressé à</h3>
                  <p>{facturation.clientId.firstname} {facturation.clientId.lastname}</p>
                  <p>{facturation.clientId.adresse}</p>
                  <p>Contact: {facturation.clientId.tel}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">De</h3>
                  <p>{defaultMedecin.name}</p>
                  <p>{defaultMedecin.adresse}</p>
                  <p>Contact: {defaultMedecin.tel}</p>
                </div>
              </div>
              
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <p>Créé le</p>
                  <p>{new Date(facturation.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>À régler avant le</p>
                  <p>{new Date(facturation.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-gray-600">Description</th>
                    <th className="px-4 py-2 border-b text-right text-gray-600">Qté</th>
                    <th className="px-4 py-2 border-b text-right text-gray-600">Prix Unitaire</th>
                    <th className="px-4 py-2 border-b text-right text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">Consultation</td>
                    <td className="px-4 py-2 border-b text-right">1</td>
                    <td className="px-4 py-2 border-b text-right">{facturation.prixConsultation.toFixed(2)} dt</td>
                    <td className="px-4 py-2 border-b text-right">{facturation.prixConsultation.toFixed(2)} dt</td>
                  </tr>

                 {/* Display Medicament if it exists */}
      {/* Display Medicament if it exists */}
      {facturation.medicamentId && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.medicamentId.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.medicamentId.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.medicamentId.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}
                  
                  {/* Display Produit Alimentaire if it exists */}
                  {facturation.produitalimentaireId && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.produitalimentaireId.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.produitalimentaireId.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.produitalimentaireId.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}
                  
                  {/* Display Materiel Consommable if it exists */}
                  {facturation.materielconsommableId && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.materielconsommableId.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.materielconsommableId.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.materielconsommableId.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              <div className="flex justify-between mt-6">
                <div>
                  <p className="text-gray-600">Prix Globale</p>
                  <p className="text-gray-600">Acompte 30%</p>
                  <p className="text-gray-600">Restant dû</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">{(facturation.prixGlobale).toFixed(2)} dt</p>
                  <p className="text-gray-900">{(facturation.prixConsultation * 0.3).toFixed(2)} dt</p>
                  <p className="text-gray-900">{(facturation.prixGlobale - facturation.prixConsultation * 0.3).toFixed(2)} dt</p>
                </div>
              </div>

              <div className="mt-6 text-gray-600">
                {/* <p>En votre aimable règlement à réception par virement bancaire. Majoration de 11% au-delà d'un mois de retard.</p>
                <p>IBAN {defaultMedecin.iban}</p>
                <p>BIC {defaultMedecin.bic}</p> */}
              </div>

             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFacturation;
