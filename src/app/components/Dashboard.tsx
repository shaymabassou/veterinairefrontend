import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles
import SideNavbar from '../components/SideNavbar';

// Register required components and scales
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [produitAlimentaires, setProduitAlimentaires] = useState([]);
  const [materielConsommables, setMaterielConsommables] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (url: string, setter: (data: any) => void) => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        return;
      }
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setter(response.data);
      } catch (error: any) {
        setError(`Échec du chargement des données : ${error.response?.data?.message || error.message}`);
      }
    };

    fetchData('http://localhost:3000/users/clients', setClients);
    fetchData('http://localhost:3000/animals', setAnimals);
    fetchData('http://localhost:3000/stock/medicaments', setMedicaments);
    fetchData('http://localhost:3000/stock/produit-alimentaires', setProduitAlimentaires);
    fetchData('http://localhost:3000/stock/materiel-consommable', setMaterielConsommables);
  }, []);

  const clientCount = clients.length;
  const animalCount = animals.length;
  const medicamentCount = medicaments.length;
  const produitAlimentaireCount = produitAlimentaires.length;
  const materielConsommableCount = materielConsommables.length;

  const chartData = (labels: string[], counts: number[], colors: string[]) => ({
    labels: labels,
    datasets: [
      {
        label: `Nombre`,
        data: counts,
        backgroundColor: colors,
      },
    ],
  });

  const doughnutData = {
    labels: ['Clients', 'Animaux', 'Médicaments', 'Produit Alimentaires', 'Matériel Consommables'],
    datasets: [
      {
        data: [clientCount, animalCount, medicamentCount, produitAlimentaireCount, materielConsommableCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', 
          'rgba(153, 102, 255, 0.6)', 
          'rgba(255, 159, 64, 0.6)', 
          'rgba(255, 99, 132, 0.6)', 
          'rgba(54, 162, 235, 0.6)'
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-[#e6f5f2]">
      <SideNavbar />
      <main className="flex-grow p-6 ml-64">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Aperçu des activités de votre clinique vétérinaire</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 shadow-lg rounded-lg bg-white text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Total Patients</h2>
            <p className="text-4xl font-bold text-gray-800">{clientCount}</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Total Animals</h2>
            <p className="text-4xl font-bold text-gray-800">{animalCount}</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Total Medications</h2>
            <p className="text-4xl font-bold text-gray-800">{medicamentCount}</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Total Produit Alimentaires</h2>
            <p className="text-4xl font-bold text-gray-800">{produitAlimentaireCount}</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Total Matériel Consommables</h2>
            <p className="text-4xl font-bold text-gray-800">{materielConsommableCount}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Statistiques</h2>
            <Bar 
              data={chartData(
                ['Clients', 'Animaux'], 
                [clientCount, animalCount], 
                ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)']
              )} 
            />
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stock Items</h2>
            <Bar 
              data={chartData(
                ['Médicaments', 'Produit Alimentaires', 'Matériel Consommables'], 
                [medicamentCount, produitAlimentaireCount, materielConsommableCount], 
                ['rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)']
              )} 
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Répartition</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} />
            </div>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendrier</h2>
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
