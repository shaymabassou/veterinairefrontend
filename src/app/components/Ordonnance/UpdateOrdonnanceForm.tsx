import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateOrdonnanceForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [form, setForm] = useState({
    nom: '',
    type: '',
    dosage: '',
    nombreDeFoisParJour: 0,
    animalId: '',
  });
  const [animals, setAnimals] = useState([]);
  const [animalNom, setAnimalNom] = useState('');
  const [animalIdentification, setAnimalIdentification] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdonnance = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/ordonnance/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ordonnanceData = response.data;
        setForm({
          nom: ordonnanceData.nom,
          type: ordonnanceData.type,
          dosage: ordonnanceData.dosage,
          nombreDeFoisParJour: ordonnanceData.nombreDeFoisParJour,
          animalId: ordonnanceData.animalId._id, // ensure animalId is the ID
        });
        setAnimalNom(ordonnanceData.animalId.nom);
        setAnimalIdentification(ordonnanceData.animalId.identification);
      } catch (error: any) {
        setError(`Échec du chargement de l'ordonnance : ${error.response?.data?.message || error.message}`);
      }
    };

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
      } catch (error: any) {
        setError('Erreur lors de la récupération des animaux.');
      }
    };

    if (id) {
      fetchOrdonnance();
      fetchAnimals();
    }
  }, [id]);

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
      await axios.put(
        `http://localhost:3000/ordonnance/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Ordonnance mise à jour avec succès.');
      router.push('/listeordonnance'); // Redirect to the ordonnances list page after successful update
    } catch (error: any) {
      setError(`Erreur lors de la mise à jour de l'ordonnance : ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Mettre à jour une Ordonnance</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
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
                {animalNom && animalIdentification && (
                  <p className="text-gray-600 mt-2">
                    Animal actuel: {animalNom} - {animalIdentification}
                  </p>
                )}
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-center">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrdonnanceForm;
