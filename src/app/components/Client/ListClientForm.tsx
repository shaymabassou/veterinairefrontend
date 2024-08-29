import React, { useState, useEffect , useMemo } from 'react';
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
  tel: number;
  adresse: string;
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
    setCurrentPage(1); 
  };

  const filteredClients =  useMemo(() => 
    clients.filter(client =>
    `${client.firstname} ${client.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [clients, searchTerm]);

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
        await axios.delete(`http://localhost:3000/users/clients/${id}`, {
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

  // Pagination state
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage =5;

 // Calculate the total number of pages
 const totalPages = Math.ceil(clients.length / itemsPerPage);

 // Get the current items to display
 const currentItems = useMemo(() => 
  filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [filteredClients, currentPage]);

 // Handle page change
 const handlePageChange = (page) => {
   setCurrentPage(page);
 };

  return (
    <div className="flex min-h-screen bg-white">
      <SideNavbar />
      <main className="flex-grow p-4 ml-64 bg-white overflow-x-hidden">
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
        <div className="overflow-x-auto bg-white p-4  rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 table-fixed">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 border-r border-gray-300">Prénom</th>
                <th className="px-4 py-2 border-r border-gray-300">Nom</th>
                <th className="px-4 py-2 border-r border-gray-300">Email</th>
                <th className="px-4 py-2 border-r border-gray-300">Téléphone</th>
                <th className="px-4 py-2 border-r border-gray-300">Adresse</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentItems.map((client) => (
                <tr key={client._id} className="hover:bg-gray-100 cursor-pointer border-b border-gray-300">
                  <td className="px-4 py-2 border-r border-gray-300 flex items-center" onClick={() => handleClientClick(client._id)}>
                    <MdPerson className="mr-2" /> {client.firstname}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300" onClick={() => handleClientClick(client._id)}>
                    {client.lastname}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">{client.email}</td>
                  <td className="px-4 py-2 border-r border-gray-300">{client.tel}</td>
                  <td className="px-4 py-2 border-r border-gray-300">{client.adresse}</td>
                  <td className="px-4 py-2 flex justify-center">
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center border border-green-500 text-green-500 px-2 py-1 rounded-md shadow-md hover:bg-green-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          router.push(`/updateclient?id=${client._id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md shadow-md hover:bg-red-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClient(client._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`px-3 py-1 mx-1 ${
        currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
      } rounded`}
    >
      {index + 1}
    </button>
  ))}
</div>
        </div>
      </main>
    </div>
  );
};

export default ListClientForm;
