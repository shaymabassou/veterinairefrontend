import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../SideNavbar';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
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

  const handleDeleteClient = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
        await axios.delete(`http://localhost:3000/users/client/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(clients.filter(client => client._id !== id));
      } catch (error: any) {
        setError(`Échec de la suppression du client : ${error.response?.data?.message || error.message}`);
        console.error('Error deleting client:', error.response?.data || error.message);
      }
    }
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
                <th className="px-4 py-2 border">Prénom</th>
                <th className="px-4 py-2 border">Nom</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">CIN</th>
                <th className="px-4 py-2 border">Téléphone</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-4 py-2 border flex items-center" onClick={() => handleClientClick(client._id)}>
                    <MdPerson className="mr-2" /> {client.firstname}
                  </td>
                  <td className="px-4 py-2 border" onClick={() => handleClientClick(client._id)}>
                    {client.lastname}
                  </td>
                  <td className="px-4 py-2 border">{client.email}</td>
                  <td className="px-4 py-2 border">{client.CIN}</td>
                  <td className="px-4 py-2 border">{client.tel}</td>
                  <td className="px-4 py-2 flex justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/updateclient?id=${client._id}`);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteClient(client._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
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
