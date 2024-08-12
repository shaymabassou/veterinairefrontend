import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const OrdonnanceForm: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    type: '',
    dosage: '',
    nombreDeFoisParJour: 0,
    animalId: '',
  });
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const medicamentNames = [
    'Penicillin',
    'Trimethoprim-Sulfa',
    'Cephalexin',
    'Enrofloxacin',
    'Carprofen',
    'Deracoxib',
    'Firocoxib',
    'Meloxicam',
    'Oxycodone',
    'Hydromorphone',
    'Butorphanol',
    'Meperidine',
    'Fentanyl',
    'Prednisolone',
    'Dexamethasone',
    'Ivomec (Ivermectin)',
    'Draxxin (Tulathromycin)',
    'Frontline (Fipronil)',
    'Dolpac',
    'Milpro',
    'Nobivac',
    'Eurican',
    'Versican',
  ];

  const medicamentTypes = [
    'Antibiotics',
    'Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)',
    'Steroids',
    'Antiparasitics',
    'Vaccines',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const animalsResponse = await axios.get('http://localhost:3000/animals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimals(animalsResponse.data);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/ordonnance',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Ordonnance ajoutée avec succès.');
      router.push('/listeordonnance'); // Redirect to the ordonnances list page after successful addition
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'ordonnance. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter une Ordonnance</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl mb-4 text-gray-600">Informations de l'Ordonnance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Nom du Médicament</label>
                <input
                  type="text"
                  name="nom"
                  list="medicament-names"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="medicament-names">
                  {medicamentNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Type de Médicament</label>
                <input
                  type="text"
                  name="type"
                  list="medicament-types"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="medicament-types">
                  {medicamentTypes.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Dosage</label>
                <input
                  type="number"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Nombre de Fois par Jour</label>
                <input
                  type="number"
                  name="nombreDeFoisParJour"
                  value={form.nombreDeFoisParJour}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Animal</label>
                <select
                  name="animalId"
                  value={form.animalId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un animal</option>
                  {animals.map((animal) => (
                    <option key={animal._id} value={animal._id}>
                      {animal.nom} - {animal.identification}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrdonnanceForm;
