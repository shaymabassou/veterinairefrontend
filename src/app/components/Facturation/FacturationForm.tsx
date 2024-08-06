import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SideNavbar from '../SideNavbar';

const FacturationForm: React.FC = () => {
  const [form, setForm] = useState({
    prixConsultation: '',
    medicamentId: '',
    produitalimentaireId: '',
    materielconsommableId: '',
  });
  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [produitalimentaires, setProduitalimentaires] = useState<any[]>([]);
  const [materielconsommables, setMaterielconsommables] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [facturationId, setFacturationId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }

      try {
        const [medicamentRes, produitAlimentaireRes, materielConsommableRes] = await Promise.all([
          axios.get('http://localhost:3000/stock/medicaments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/stock/produit-alimentaires', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/stock/materiel-consommable', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMedicaments(medicamentRes.data);
        setProduitalimentaires(produitAlimentaireRes.data);
        setMaterielconsommables(materielConsommableRes.data);
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
        prixConsultation: parseFloat(form.prixConsultation),
        medicamentId: form.medicamentId || null,
        produitalimentaireId: form.produitalimentaireId || null,
        materielconsommableId: form.materielconsommableId || null,
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

      setFacturationId(response.data._id); // Assuming the response contains the new facturation ID
      setSuccess('Facturation ajoutée avec succès.');
      router.push(`/facturation/${response.data._id}`); // Redirect to the details page of the newly created facturation
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError('Erreur lors de l\'ajout de la facturation. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideNavbar />
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-100 ml-60">
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl mb-6 text-center font-semibold text-gray-700">Ajouter une Facturation</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Medicament</label>
                  <select
                    name="medicamentId"
                    value={form.medicamentId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un medicament</option>
                    {medicaments.map((medicament) => (
                      <option key={medicament._id} value={medicament._id}>
                        {medicament.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Prix</label>
                  <input
                    type="text"
                    name="prixVenteMedicament"
                    value={medicaments.find((m) => m._id === form.medicamentId)?.prixVente || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Produit Alimentaire</label>
                  <select
                    name="produitalimentaireId"
                    value={form.produitalimentaireId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un produit alimentaire</option>
                    {produitalimentaires.map((produitAlimentaire) => (
                      <option key={produitAlimentaire._id} value={produitAlimentaire._id}>
                        {produitAlimentaire.nom} 
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Prix</label>
                  <input
                    type="text"
                    name="prixVenteProduitAlimentaire"
                    value={produitalimentaires.find((p) => p._id === form.produitalimentaireId)?.prixVente || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Matériel Consommable</label>
                  <select
                    name="materielconsommableId"
                    value={form.materielconsommableId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un matériel consommable</option>
                    {materielconsommables.map((materielConsommable) => (
                      <option key={materielConsommable._id} value={materielConsommable._id}>
                        {materielConsommable.nom} 
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Prix</label>
                  <input
                    type="text"
                    name="prixVenteMaterielConsommable"
                    value={materielconsommables.find((m) => m._id === form.materielconsommableId)?.prixVente || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default FacturationForm;
