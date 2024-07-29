import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const ClientForm: React.FC = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    CIN: '',
    tel: '',
    adresse: '',
    dateNaissance: ''
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

      setSuccess('Client ajouté avec succès.');
      router.push('/listeclient'); // Redirect to the clients page after successful addition
    } catch (error) {
      setError('Erreur lors de l\'ajout du client. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter un Client</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="text-center">
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

export default ClientForm;
