import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const ClientAndAnimalForm: React.FC = () => {
  const [form, setForm] = useState({

    firstname: '',
    lastname: '',
    email: '',
    CIN: '',
    tel: '',
    adresse: '',
    dateNaissance: '',
    numero_de_fiche: '',
    nom_prioritaire: '',
    race: '',
    age: '',
    sex: '',
    identification: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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
    const clientResponse = await axios.post(
      'http://localhost:3000/users/client',
      {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        CIN: form.CIN,
        tel: form.tel,
        adresse: form.adresse,
        dateNaissance: form.dateNaissance
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Client Response:', clientResponse.data);
    const clientId = clientResponse.data._id ;  // Utilisez le bon champ


    if (!clientId) {
      setError("L'ID du client n'a pas été trouvé après la création.");
      return;
    }

    const animalResponse = await axios.post(
      'http://localhost:3000/animals',
      {
        numero_de_fiche: form.numero_de_fiche,
        nom_prioritaire: form.nom_prioritaire,
        race: form.race,
        age: form.age,
        sex: form.sex,
        identification: form.identification,
        clientId: clientId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Animal Response:', animalResponse.data);

    setSuccess('Client et animal ajoutés avec succès');
    router.push('/listeclient');
  } catch (error: any) {
    setError(`Échec de l'ajout du client et de l'animal : ${error.response?.data?.message || error.message}`);
    console.error('Failed to add client and animal:', error.response?.data || error.message);
  }
};

  
  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full p-8 ">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-600">Ajouter un Client et un Animal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section Client */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">FirstName</label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">LastName</label>
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CIN</label>
              <input
                type="text"
                name="CIN"
                value={form.CIN}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Tel</label>
              <input
                type="tel"
                name="tel"
                value={form.tel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date de Naissance</label>
              <input
                type="date"
                name="dateNaissance"
                value={form.dateNaissance}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            {/* Section Animal */}
            <div>
              <label className="block text-gray-700 mb-2">Numéro de Fiche</label>
              <input
                type="text"
                name="numero_de_fiche"
                value={form.numero_de_fiche}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
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
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
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
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Âge</label>
              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Sexe</label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              >
                <option value="">Select Sex</option>
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
                className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {success && <div className="text-green-500 mt-4">{success}</div>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientAndAnimalForm;
