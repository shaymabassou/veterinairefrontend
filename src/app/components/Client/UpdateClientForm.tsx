import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateClientForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [client, setClient] = useState({
    firstname: '',
    lastname: '',
    email: '',
    CIN: '',
    tel: '',
    adresse: '',
    dateNaissance: '',
    animalid: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token non trouvé. Veuillez vous reconnecter.');
          return;
        }

        try {
          const response = await axios.get(`http://localhost:3000/users/clients/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const clientData = response.data;
          setClient({
            firstname: clientData.firstname,
            lastname: clientData.lastname,
            email: clientData.email,
            CIN: clientData.CIN,
            tel: clientData.tel,
            adresse: clientData.adresse,
            dateNaissance: clientData.dateNaissance,
            animalid: clientData.animalid,
          });
        } catch (error: any) {
          setError(`Échec du chargement du client : ${error.response?.data?.message || error.message}`);
        }
      };

      fetchClient();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
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
        `http://localhost:3000/users/clients/${id}`,
        client,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Client mis à jour avec succès');
      router.push('/listeclient');
    } catch (error: any) {
      setError(`Échec de la mise à jour du client : ${error.response?.data?.message || error.message}`);
      console.error('Error updating client:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center bg-cover bg-center">
        <div className="w-full max-w-lg bg-white bg-opacity-10 p-9 rounded-lg shadow-lg ml-40">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl mb-6 text-center">Mettre à jour le Client</h2>
            {['firstname', 'lastname', 'email', 'CIN', 'tel', 'adresse', 'dateNaissance', 'animalid'].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type="text"
                  name={field}
                  value={client[field as keyof typeof client]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateClientForm;
