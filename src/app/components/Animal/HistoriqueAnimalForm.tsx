import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const HistoriqueAnimalForm: React.FC = () => {
  const [form, setForm] = useState({
    dateVisite: '',
    description: '',
    animalId: ''
  });
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnimals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/animals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimals(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des animaux.');
      }
    };
    fetchAnimals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
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
        `http://localhost:3000/animals/${form.animalId}/historique`,
        {
          dateVisite: form.dateVisite,
          description: form.description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Historique ajouté avec succès.');
      router.push('/listehistorique'); // Redirect to the historiques list page after successful addition
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'historique. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter un Historique Animal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl mb-4 text-gray-600">Informations de l'Historique</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Date de Visite</label>
                <input
                  type="date"
                  name="dateVisite"
                  value={form.dateVisite}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
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
                      {animal.nom_prioritaire} - {animal.identification}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-center">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueAnimalForm;
