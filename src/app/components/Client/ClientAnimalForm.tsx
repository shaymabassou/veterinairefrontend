import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const ClientAnimalForm: React.FC = () => {
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
    espece: '',
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
      // Create client first
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
      const clientId = clientResponse.data._id;

      // Create animal with the clientId
      const animalResponse = await axios.post(
        'http://localhost:3000/animals',
        {
          numero_de_fiche: form.numero_de_fiche,
          nom_prioritaire: form.nom_prioritaire,
          espece: form.espece,
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
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter un Client et un Animal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Client */}
            <h3 className="text-2xl mb-4 text-gray-600">Informations du Client</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">FirstName</label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date de Naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={form.dateNaissance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Section Animal */}
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
                <label className="block text-gray-700 mb-2">Espece</label>
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
                  <option value="">Sélectionnez un sexe</option>
                  <option value="Mâle">Mâle</option>
                  <option value="Femelle">Femâle</option>
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
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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

export default ClientAnimalForm;
