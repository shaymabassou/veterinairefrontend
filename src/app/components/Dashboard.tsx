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
  const [totalStaff, setTotalStaff] = useState(240); // Example static value for staff
  const [onShiftStaff, setOnShiftStaff] = useState(135); // Example static value
  const [totalRooms, setTotalRooms] = useState(340); // Example static value for rooms
  const [occupiedRooms, setOccupiedRooms] = useState(168); // Example static value
  const [totalAnimalsToday, setTotalAnimalsToday] = useState(38); // Example static value
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
    <div className="flex min-h-screen bg-gray-100">
      <SideNavbar />
      <main className="flex-grow p-8 ml-64">
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Tableau de Bord</h1>
<p className="text-gray-600">Aperçu des statistiques de la clinique vétérinaire</p>
</div>
{error && <p className="text-red-500 mb-4">{error}</p>}

{/* Section des Cartes de Statistiques */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="p-6 shadow-lg rounded-lg bg-white flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Total Clients</h2>
      <p className="text-lg font-semibold text-green-500">{clientCount}</p>
      <p className="text-sm text-gray-600">Aujourd'hui : 1</p> {/* Exemple de valeur dynamique */}
    </div>
  </div>
  <div className="p-6 shadow-lg rounded-lg bg-white flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Total Personnel</h2>
      <p className="text-lg font-semibold text-green-500">{totalStaff}</p>
      <p className="text-sm text-gray-600">En service : {onShiftStaff}</p>
    </div>
  </div>
  <div className="p-6 shadow-lg rounded-lg bg-white flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Total Chambres</h2>
      <p className="text-lg font-semibold text-green-500">{totalRooms}</p>
      <p className="text-sm text-gray-600">Occupées : {occupiedRooms}</p>
    </div>
  </div>
</div>


        {/* Total Animals Today */}
        {/* <div className="mb-8">
          <div className="p-6 shadow-lg rounded-lg bg-blue-500 text-white"> */}
            {/* <h2 className="text-2xl font-bold">Total Animals Today</h2>
            <p className="text-4xl font-semibold">{totalAnimalsToday}</p> */}
            {/* You can add more details here */}
          {/* </div>
        </div> */}

        {/* Calendar and Data Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendrier</h2>
            <Calendar />
          </div>
          <div className="p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Répartition des Données</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Statistiques des Patients</h2>
            <Bar 
              data={chartData(
                ['Clients', 'Animaux'], 
                [clientCount, animalCount], 
                ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)']
              )} 
            />
          </div>
          <div className="p-6 shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inventaire du Stock</h2>
            <Bar 
              data={chartData(
                ['Médicaments', 'Produit Alimentaires', 'Matériel Consommables'], 
                [medicamentCount, produitAlimentaireCount, materielConsommableCount], 
                ['rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)']
              )} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
