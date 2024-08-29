import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEdit, FaEye, FaTrash , FaCheck} from 'react-icons/fa';
import SideNavbar from '../SideNavbar';

const FacturationForm: React.FC = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState({
    prixConsultation: '',
    facture_n: '',
    date: getCurrentDate(),
    clientId: '',
    clientAdresse: '',
    clientTel: '',
    medicamentId: '',
    produitalimentaireId: '',
    materielconsommableId: '',
  });

  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [produitalimentaires, setProduitalimentaires] = useState<any[]>([]);
  const [materielconsommables, setMaterielconsommables] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState({
    medicament: false,
    produitalimentaire: false,
    materielconsommable: false,
  });

  const [prixGlobale, setPrixGlobale] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [facturations, setFacturations] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const [medicamentRes, produitAlimentaireRes, materielConsommableRes, clientsRes, facturationsRes] = await Promise.all([
          axios.get('http://localhost:3000/stock/medicaments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/stock/produit-alimentaires', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/stock/materiel-consommable', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/users/clients', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/facturation', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMedicaments(medicamentRes.data);
        setProduitalimentaires(produitAlimentaireRes.data);
        setMaterielconsommables(materielConsommableRes.data);
        setClients(clientsRes.data);
        setFacturations(facturationsRes.data);
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(facturations.length / itemsPerPage);

  // Get the current items to display
  const currentItems = facturations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  
  useEffect(() => {
    let total = parseFloat(form.prixConsultation) || 0;

    if (selectedOptions.medicament && form.medicamentId) {
      const selectedMedicament = medicaments.find(m => m._id === form.medicamentId);
      if (selectedMedicament) total += selectedMedicament.prixVente || 0;
    }

    if (selectedOptions.produitalimentaire && form.produitalimentaireId) {
      const selectedProduitAlimentaire = produitalimentaires.find(p => p._id === form.produitalimentaireId);
      if (selectedProduitAlimentaire) total += selectedProduitAlimentaire.prixVente || 0;
    }

    if (selectedOptions.materielconsommable && form.materielconsommableId) {
      const selectedMaterielConsommable = materielconsommables.find(m => m._id === form.materielconsommableId);
      if (selectedMaterielConsommable) total += selectedMaterielConsommable.prixVente || 0;
    }

    setPrixGlobale(total);
  }, [form, selectedOptions, medicaments, produitalimentaires, materielconsommables]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions({
      ...selectedOptions,
      [e.target.name]: e.target.checked,
    });
    
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleViewFacturation = (id: string) => {
    router.push(`/facturation/${id}`);
  };
  
  const handleEditFacturation = (id: string) => {
    router.push(`/updatefacturation?id=${id}`);
  };
  
  const handleDeleteFacturation = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3000/facturation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFacturations(facturations.filter(facturation => facturation._id !== id));
      setSuccess('Facturation supprimée avec succès.');
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de la suppression de la facturation. Veuillez réessayer.");
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClient = clients.find(client => client._id === e.target.value);
    setForm({
      ...form,
      clientId: e.target.value,
      clientAdresse: selectedClient ? selectedClient.adresse : '',
      clientTel: selectedClient ? selectedClient.tel : '',
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
      const formData = {
        ...form,
        prixConsultation: parseFloat(form.prixConsultation),
        prixGlobale,
      };


      const response = await axios.post(
        'http://localhost:3000/facturation',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFacturations([...facturations, response.data]);
      setSuccess('Facturation ajoutée avec succès.');
      // Réinitialiser le formulaire après soumission
      setForm({
        prixConsultation: '',
        facture_n: '',
        date: getCurrentDate(),
        clientId: '',
        clientAdresse: '',
        clientTel: '',
        medicamentId: '',
        produitalimentaireId: '',
        materielconsommableId: '',
      });
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de l'ajout de la facturation. Veuillez réessayer.");
    }
  };

  const getItemPrice = (id: string, list: any[]) => {
    const item = list.find(i => i._id === id);
    return item ? item.prixVente : 0;
  };

  const handleMarkAsPaid = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token non trouvé. Veuillez vous reconnecter.');
      return;
    }

    setLoading(true);  // Activer l'état de chargement avant de commencer la requête

    try {
      await axios.patch(`http://localhost:3000/facturation/${id}/pay`, {
        status: 'payé',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFacturations(prevFacturations =>
        prevFacturations.map(facturation =>
          facturation._id === id ? { ...facturation, status: 'payé' } : facturation
        )
      );
      setSuccess('Statut de la facturation mis à jour avec succès.');
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de la mise à jour du statut de la facturation. Veuillez réessayer.");
    } finally {
      setLoading(false);  // Désactiver l'état de chargement après la fin de la requête
    }
  };



  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white-100 ml-60">
        <div className="w-full p-20">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter une Facturation</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Numéro de Facture</label>
                <input
                  type="number"
                  name="facture_n"
                  value={form.facture_n}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
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
                  onChange={handleClientChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un client</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.firstname} {client.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Adresse du Client</label>
                <input
                  type="text"
                  name="clientAdresse"
                  value={form.clientAdresse}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Téléphone du Client</label>
                <input
                  type="text"
                  name="clientTel"
                  value={form.clientTel}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Prix Consultation</label>
                <input
                  type="number"
                  name="prixConsultation"
                  value={form.prixConsultation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Ajouter un Médicament</label>
              <input
                type="checkbox"
                name="medicament"
                checked={selectedOptions.medicament}
                onChange={handleCheckboxChange}
                className="mr-2 leading-tight"
              />
              {selectedOptions.medicament && (
                <select
                  name="medicamentId"
                  value={form.medicamentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un médicament</option>
                  {medicaments.map(medicament => (
                    <option key={medicament._id} value={medicament._id}>
                      {medicament.nom} (Prix: {medicament.prixVente})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Ajouter un Produit Alimentaire</label>
              <input
                type="checkbox"
                name="produitalimentaire"
                checked={selectedOptions.produitalimentaire}
                onChange={handleCheckboxChange}
                className="mr-2 leading-tight"
              />
              {selectedOptions.produitalimentaire && (
                <select
                  name="produitalimentaireId"
                  value={form.produitalimentaireId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un produit alimentaire</option>
                  {produitalimentaires.map(produitalimentaire => (
                    <option key={produitalimentaire._id} value={produitalimentaire._id}>
                      {produitalimentaire.nom} (Prix: {produitalimentaire.prixVente})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Ajouter un Matériel Consommable</label>
              <input
                type="checkbox"
                name="materielconsommable"
                checked={selectedOptions.materielconsommable}
                onChange={handleCheckboxChange}
                className="mr-2 leading-tight"
              />
              {selectedOptions.materielconsommable && (
                <select
                  name="materielconsommableId"
                  value={form.materielconsommableId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un matériel consommable</option>
                  {materielconsommables.map(materielconsommable => (
                    <option key={materielconsommable._id} value={materielconsommable._id}>
                      {materielconsommable.nom} (Prix: {materielconsommable.prixVente})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white w-15 px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10"
              >
                Ajouter 
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-center">{error}</div>
            )}
            {success && (
              <div className="mt-4 text-green-600 text-center">{success}</div>
            )}
          </form>

          <h2 className="text-2xl mt-10 mb-4 text-center font-semibold text-gray-700">Liste des Facturations</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Numéro de Facture</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Client</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Prix Consultation</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Prix Globale</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>

              
            {currentItems.map(facturation => (
                
                <tr key={facturation._id}>
                  <td className="px-4 py-2 border border-gray-300">{facturation.facture_n}</td>
                  <td className="px-4 py-2 border border-gray-300">{new Date(facturation.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border border-gray-300">{facturation.clientId ? `${facturation.clientId.firstname} ${facturation.clientId.lastname}`: ''}</td>
                  <td className="px-4 py-2 border border-gray-300">{facturation.prixConsultation}dt</td>
                  <td className="px-4 py-2 border border-gray-300">{facturation.prixGlobale}dt</td>
                
                  <td className="px-4 py-2 border border-gray-300">
  {facturation.status === 'payée' ? (
    <span className="text-green-500 font-semibold">Payée</span>
  ) : (
    <span className="text-red-500 font-semibold">Impayée</span>
  )}
</td>
<td className="px-4 py-2 border-b">
  <div className="flex justify-center space-x-2">
    <FaEye
      className="text-blue-500 cursor-pointer  "
      onClick={() => handleViewFacturation(facturation._id)}
    />
    <FaEdit
      className="text-green-500 cursor-pointer "
      onClick={() => handleEditFacturation(facturation._id)}
    />
    <FaTrash
      className="text-red-500 cursor-pointer"
      onClick={() => handleDeleteFacturation(facturation._id)}
    />
    {facturation.status !== 'payée' && (
      <FaCheck
          className={`text-green-500 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !loading && handleMarkAsPaid(facturation._id)}
        />
    )}
  </div>
</td>
 </tr> ))}
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
        </div>
      </div>
    );
};

export default FacturationForm;