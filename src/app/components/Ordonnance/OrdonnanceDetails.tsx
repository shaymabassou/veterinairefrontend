import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';
import { useReactToPrint } from 'react-to-print';

interface Ordonnance {
  _id: string;
  nom: string;
  type: string;
  dosage: string;
  nombreDeFoisParJour: number;
  animalId: {
    nom: string;
    identification: string;
  } | null;
}

const OrdonnanceDetails: React.FC = () => {
  const [ordonnance, setOrdonnance] = useState<Ordonnance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrdonnance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/ordonnance/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdonnance(response.data);
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    if (id) fetchOrdonnance();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-12 ml-60">
        {error && <div className="text-red-600">{error}</div>}
        {ordonnance && (
          <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-5xl relative" ref={printRef}>
            <div className="absolute top-0 right-0">
              <img src="/images/vet.jpg" alt="Symbol" className="h-24 w-24 object-cover m-4 rounded-full border-2 border-blue-500 shadow-md" />
            </div>
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-blue-600">Dr. Name Docter</h1>
              <p className="text-gray-600">Vétérinaire</p>
              <p className="text-gray-500">1234 Veterinary , Sousse, Animal City</p>
            </div>

            <div className="flex justify-between mt-12 mb-10">
              <div className="w-full">
                <p className="mb-2 text-lg"><strong>Animal:</strong> {ordonnance.animalId ? `${ordonnance.animalId.nom} - ${ordonnance.animalId.identification}` : 'N/A'}</p>
                <p className="mb-2 text-lg"><strong>Médicament:</strong> {ordonnance.nom}</p>
                <p className="mb-2 text-lg"><strong>Type:</strong> {ordonnance.type}</p>
                <p className="mb-4 text-lg"><strong>Dosage:</strong> {ordonnance.dosage}</p>
                <p className="mb-4 text-lg"><strong>Nombre de Fois par Jour:</strong> {ordonnance.nombreDeFoisParJour}</p>
              </div>
            </div>

            <div className="text-right w-full mt-12">
              <p className="mb-6 text-lg"><strong>Signature:</strong> ___________________________</p>
              <p className="text-lg"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            <div className="text-right mt-8">
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 print:hidden"
              >
                Imprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdonnanceDetails;
