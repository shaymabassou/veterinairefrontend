import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { useReactToPrint } from 'react-to-print';

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
  isPaid: boolean; // Ajouter un champ pour indiquer si la facture est payée
  medicament?: {
    medicamentId: string;
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
  const [isPaid, setIsPaid] = useState<boolean>(false); // État pour le statut de paiement
  const router = useRouter();
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

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
        setFacturation(response.data);
        setIsPaid(response.data.isPaid); // Initialiser le statut de paiement
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    if (id) fetchFacturation();
  }, [id]);

  const handleMarkAsPaid = () => {
    setIsPaid(true); // Marquer comme payé
    setSuccess('La facture a été marquée comme payée.');
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 1,
      filename: `facture_${facturation?.facture_n || '2024-XX'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    if (element) {
      html2pdf().from(element).set(opt).save();
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-100 bg-white-100 ml-60">
        <div className="w-full p-50">
          {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
          {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
          {facturation && (
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-10" ref={printRef}>
              <h2 className="text-3xl font-bold mb-20 text-blue-900">FACTURE 2024-XX</h2>

              <div className="mb-10 grid grid-cols-2 gap-10">
                <div>
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

                  {facturation.medicament && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.medicament.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.medicament.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.medicament.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}

                  {facturation.produitalimentaire && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.produitalimentaire.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.produitalimentaire.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.produitalimentaire.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}

                  {facturation.materielconsommable && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{facturation.materielconsommable.nom}</td>
                      <td className="px-4 py-2 border-b text-right">1</td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.materielconsommable.prixVente).toFixed(2)} dt
                      </td>
                      <td className="px-4 py-2 border-b text-right">
                        {Number(facturation.materielconsommable.prixVente).toFixed(2)} dt
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-6 flex justify-between">
                <p className="text-gray-800 font-bold">Prix total: {facturation.prixGlobale.toFixed(2)} dt</p>
              </div>

              <div className="mt-6 flex justify-between">
                <p className={`font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                  Statut de paiement: {isPaid ? 'Payée' : 'Non payée'}
                </p>
                {!isPaid && (
                  <button onClick={handleMarkAsPaid} className="bg-green-500 text-white py-2 px-4 rounded">
                    Marquer comme payée
                  </button>
                )}
              </div>

              <div className="mt-10 flex justify-end space-x-4">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Télécharger PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Imprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsFacturation;
