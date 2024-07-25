import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  CIN: string;
  tel: string;
  adresse: string;
  dateNaissance: string;
  animalid: string;
}

const ListClientForm: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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
      } catch (error: any) {
        setError(`Échec du chargement des clients : ${error.response?.data?.message || error.message}`);
        console.error('Error fetching clients:', error.response?.data || error.message);
      }
    };

    fetchClients();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter(client =>
    `${client.firstname} ${client.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClientClick = () => {
    router.push('/addclient');
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-600">Liste des Clients</h1>
          <button
            className="w-12 h-12 rounded-md border border-gray-300 text-gray-500 shadow-md hover:bg-gray-100 flex items-center justify-center transition duration-200"
            onClick={handleAddClientClick}
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
        <div className="relative mb-4 flex items-center w-full max-w-md shadow-sm">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full bg-white border table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border"></th>
                <th className="py-2 px-4 border">Prénom</th>
                <th className="py-2 px-4 border">Nom</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">CIN</th>
                <th className="py-2 px-4 border">Téléphone</th>
                <th className="py-2 px-4 border">Adresse</th>
                <th className="py-2 px-4 border">Date de Naissance</th>
                {/* <th className="py-2 px-4 border">Animal ID</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr
                  key={client._id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleClientClick(client._id)}
                >
                  <td className="py-2 px-4 border">
                    <MdPerson className="text-2xl text-gray-500" />
                  </td>
                  <td className="py-2 px-4 border">{client.firstname}</td>
                  <td className="py-2 px-4 border">{client.lastname}</td>
                  <td className="py-2 px-4 border">{client.email}</td>
                  <td className="py-2 px-4 border">{client.CIN}</td>
                  <td className="py-2 px-4 border">{client.tel}</td>
                  <td className="py-2 px-4 border">{client.adresse}</td>
                  <td className="py-2 px-4 border">{new Date(client.dateNaissance).toLocaleDateString()}</td>
                  {/* <td className="py-2 px-4 border">{client.animalid}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ListClientForm;
