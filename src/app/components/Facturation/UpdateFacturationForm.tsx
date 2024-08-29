import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateFacturationForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

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
    date: '',
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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const [
          facturationRes,
          medicamentRes,
          produitAlimentaireRes,
          materielConsommableRes,
          clientsRes,
        ] = await Promise.all([
          axios.get(`http://localhost:3000/facturation/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
        ]);

        const facturation = facturationRes.data;
        setForm({
          prixConsultation: facturation.prixConsultation,
          facture_n: facturation.facture_n,
          date: facturation.date ? facturation.date.slice(0, 10) : '',
          clientId: facturation.clientId?._id || null,
          clientAdresse: facturation.clientId?.adresse || '',
          clientTel: facturation.clientId?.tel || '',
          medicamentId: facturation.medicamentId?._id || null,
  produitalimentaireId: facturation.produitalimentaireId?._id || null,
  materielconsommableId: facturation.materielconsommableId?._id || null,
        });

        setMedicaments(medicamentRes.data);
        setProduitalimentaires(produitAlimentaireRes.data);
        setMaterielconsommables(materielConsommableRes.data);
        setClients(clientsRes.data);
        setSelectedOptions({
          medicament: !!facturation.medicamentId, // true si medicamentId existe, false sinon
          produitalimentaire: !!facturation.produitalimentaireId, // true si produitalimentaireId existe, false sinon
          materielconsommable: !!facturation.materielconsommableId, // true si materielconsommableId existe, false sinon
        });
        
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    let total = parseFloat(form.prixConsultation) || 0;
  
    if (selectedOptions.medicament && form.medicamentId) {
      const selectedMedicament = medicaments.find(m => m._id === form.medicamentId);
      if (selectedMedicament) total += parseFloat(selectedMedicament.prixVente) || 0;
    }
  
    if (selectedOptions.produitalimentaire && form.produitalimentaireId) {
      const selectedProduitAlimentaire = produitalimentaires.find(p => p._id === form.produitalimentaireId);
      if (selectedProduitAlimentaire) total += parseFloat(selectedProduitAlimentaire.prixVente) || 0;
    }
  
    if (selectedOptions.materielconsommable && form.materielconsommableId) {
      const selectedMaterielConsommable = materielconsommables.find(m => m._id === form.materielconsommableId);
      if (selectedMaterielConsommable) total += parseFloat(selectedMaterielConsommable.prixVente) || 0;
    }
  
    setPrixGlobale(total);
  }, [
    form.prixConsultation,
    form.medicamentId,
    form.produitalimentaireId,
    form.materielconsommableId,
    selectedOptions,
    medicaments,
    produitalimentaires,
    materielconsommables,
  ]);
  

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

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClient = clients.find(client => client._id === e.target.value);
    if (selectedClient) {
      setForm({
        ...form,
        clientId: selectedClient._id,
        clientAdresse: selectedClient.adresse,
        clientTel: selectedClient.tel,
      });
    }
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

      await axios.put(
        `http://localhost:3000/facturation/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Facturation mise à jour avec succès.');
      router.push('/addfacturation');
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de la mise à jour de la facturation. Veuillez réessayer.");
    }
  };

  return (
    <div className="center">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white-100 ml-40">
        <div className="w-full p-20">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Mettre à jour la Facturation</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
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
                  <option value="">Sélectionner un client</option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Numéro de Téléphone du Client</label>
                <input
                  type="text"
                  name="clientTel"
                  value={form.clientTel}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded"
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
              <div>
                <label className="block text-gray-700 mb-2">Sélectionner les éléments</label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="checkbox"
                      id="medicament"
                      name="medicament"
                      checked={selectedOptions.medicament}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="medicament" className="ml-2">Médicament</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="produitalimentaire"
                      name="produitalimentaire"
                      checked={selectedOptions.produitalimentaire}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="produitalimentaire" className="ml-2">Produit Alimentaire</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="materielconsommable"
                      name="materielconsommable"
                      checked={selectedOptions.materielconsommable}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="materielconsommable" className="ml-2">Matériel Consommable</label>
                  </div>
                </div>
              </div>
              {selectedOptions.medicament && (
                <div>
                  <label className="block text-gray-700 mb-2">Médicament</label>
                  <select
                    name="medicamentId"
                    value={form.medicamentId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un médicament</option>
                    {medicaments.map(medicament => (
                      <option key={medicament._id} value={medicament._id}>
                      {medicament.nom} (Prix: {medicament.prixVente})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedOptions.produitalimentaire && (
                <div>
                  <label className="block text-gray-700 mb-2">Produit Alimentaire</label>
                  <select
                    name="produitalimentaireId"
                    value={form.produitalimentaireId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un produit alimentaire</option>
                    {produitalimentaires.map(produit => (
                      <option key={produit._id} value={produit._id}>
                        {produit.nom} (Prix: {produit.prixVente})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedOptions.materielconsommable && (
                <div>
                  <label className="block text-gray-700 mb-2">Matériel Consommable</label>
                  <select
                    name="materielconsommableId"
                    value={form.materielconsommableId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un matériel consommable</option>
                    {materielconsommables.map(materiel => (
                      <option key={materiel._id} value={materiel._id}>
                        {materiel.nom} (Prix: {materiel.prixVente})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFacturationForm;
