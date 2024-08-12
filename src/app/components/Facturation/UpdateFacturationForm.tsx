import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const UpdateFacturationForm: React.FC<{ facturationId: string }> = ({ facturationId }) => {
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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const [medicamentRes, produitAlimentaireRes, materielConsommableRes, clientsRes, facturationRes] = await Promise.all([
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
          axios.get(`http://localhost:3000/facturation/${facturationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMedicaments(medicamentRes.data);
        setProduitalimentaires(produitAlimentaireRes.data);
        setMaterielconsommables(materielConsommableRes.data);
        setClients(clientsRes.data);

        const facturationData = facturationRes.data;
        setForm({
          prixConsultation: facturationData.prixConsultation,
          facture_n: facturationData.facture_n,
          date: facturationData.date || getCurrentDate(),
          clientId: facturationData.clientId,
          clientAdresse: facturationData.clientAdresse,
          clientTel: facturationData.clientTel,
          medicamentId: facturationData.medicamentId || '',
          produitalimentaireId: facturationData.produitalimentaireId || '',
          materielconsommableId: facturationData.materielconsommableId || '',
        });

        setSelectedOptions({
          medicament: !!facturationData.medicamentId,
          produitalimentaire: !!facturationData.produitalimentaireId,
          materielconsommable: !!facturationData.materielconsommableId,
        });
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, [facturationId]);

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

      await axios.put(
        `http://localhost:3000/facturation/${facturationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Facturation mise à jour avec succès.');
      router.push('/facturation');
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError("Erreur lors de la mise à jour de la facturation. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white-100 ml-60">
        <div className="w-full p-20">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Mettre à jour une Facturation</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields (Similar to FacturationForm) */}
            {/* Similar to FacturationForm, but populated with data from the existing facturation */}
            {/* Display the fields with the current values and allow modification */}
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
                      {client.nom} {client.prenom}
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Téléphone du Client</label>
                <input
                  type="text"
                  name="clientTel"
                  value={form.clientTel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Prix de la Consultation</label>
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

            <div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un médicament</option>
                  {medicaments.map(medicament => (
                    <option key={medicament._id} value={medicament._id}>
                      {medicament.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un produit alimentaire</option>
                  {produitalimentaires.map(produitalimentaire => (
                    <option key={produitalimentaire._id} value={produitalimentaire._id}>
                      {produitalimentaire.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un matériel consommable</option>
                  {materielconsommables.map(materielconsommable => (
                    <option key={materielconsommable._id} value={materielconsommable._id}>
                      {materielconsommable.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Prix Total</label>
              <input
                type="number"
                value={prixGlobale}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Mettre à jour la Facturation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFacturationForm;
