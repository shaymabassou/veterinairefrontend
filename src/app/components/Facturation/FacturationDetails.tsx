import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import SideNavbar from '../SideNavbar';

const FacturationDetails: React.FC = () => {
  const { id } = useParams();
  const [facturation, setFacturation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

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
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchFacturation();
  }, [id]);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!facturation) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-grow flex items-center justify-center p-5 bg-gray-100">
        <div className="w-full max-w-2xl p-20 bg-white shadow-lg rounded-lg ml-60">
          <div ref={componentRef}>
            <h2 className="text-4xl mb-8 text-center font-semibold text-gray-800">Facturation</h2>
            <div className="border-t border-gray-300 pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-xl text-gray-800">
                  <p><span className="font-semibold">Prix Consultation:</span> {facturation.prixConsultation} dt</p>
                  {facturation.medicament && (
                    <p><span className="font-semibold">Médicament:</span> {facturation.medicament.nom} - {facturation.medicament.prixVente} dt</p>
                  )}
                  {facturation.produitAlimentaire && (
                    <p><span className="font-semibold">Produit Alimentaire:</span> {facturation.produitAlimentaire.nom} - {facturation.produitAlimentaire.prixVente} dt</p>
                  )}
                  {facturation.materielConsommable && (
                    <p><span className="font-semibold">Matériel Consommable:</span> {facturation.materielConsommable.nom} - {facturation.materielConsommable.prixVente} dt</p>
                  )}
                </div>
                <div className="text-xl text-gray-800">
                  <p><span className="font-semibold">Prix Globale:</span> {facturation.prixGlobale} dt</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Imprimer PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturationDetails;
