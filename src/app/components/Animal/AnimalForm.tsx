import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const AnimalForm: React.FC = () => {
  const [form, setForm] = useState({
    numero_de_fiche: '',
    nom_prioritaire: '',
    espece: '',
    race: '',
    age: '',
    sex: '',
    identification: '',
    clientId: ''
  });
  const [clients, setClients] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/users/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des clients.');
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        'http://localhost:3000/animals',
        {
          numero_de_fiche: form.numero_de_fiche,
          nom_prioritaire: form.nom_prioritaire,
          espece: form.espece,
          race: form.race,
          age: form.age,
          sex: form.sex,
          identification: form.identification,
          clientId: form.clientId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Animal ajouté avec succès.');
      router.push('/listeanimal'); // Redirect to the animals list page after successful addition
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'animal. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter un Animal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl mb-4 text-gray-600">Informations de l'Animal</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Numéro de Fiche</label>
                <input
                  type="text"
                  name="numero_de_fiche"
                  value={form.numero_de_fiche}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Nom Prioritaire</label>
                <input
                  type="text"
                  name="nom_prioritaire"
                  value={form.nom_prioritaire}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Espèce</label>
                <input
                  type="text"
                  name="espece"
                  value={form.espece}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Race</label>
                <input
                  type="text"
                  name="race"
                  value={form.race}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Âge</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sexe</label>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner le sexe</option>
                  <option value="Mâle">Mâle</option>
                  <option value="Femâle">Femâle</option>
                  <option value="Trans">Trans</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Identification</label>
                <input
                  type="text"
                  name="identification"
                  value={form.identification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Client</label>
                <select
                  name="clientId"
                  value={form.clientId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.firstname} {client.lastname}
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

export default AnimalForm;
