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
    dateNaissance: '',
    animalid: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        'http://localhost:3000/users/client',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Client ajouté avec succès');
      router.push('/listeclient');
    } catch (error: any) {
      setError(`Échec de l'ajout du client : ${error.response?.data?.message || error.message}`);
      console.error('Failed to add client:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full p-8 ">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-600">Ajouter un Client</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Date de Naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={form.dateNaissance}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">ID de l'Animal</label>
                <input
                  type="text"
                  name="animalid"
                  value={form.animalid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black-400 rounded focus:outline-none focus:ring-2 focus:ring-black-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
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

export default ClientForm;
