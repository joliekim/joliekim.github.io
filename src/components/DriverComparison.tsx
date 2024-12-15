// src/components/DriverComparison.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DriverStats {
  name: string;
  totalPoints: number;
  wins: number;
  races: number;
  pointsPerRace: number;
}

interface TeamDriversData {
  [teamName: string]: {
    drivers: DriverStats[];
    color: string;
  };
}

const teamDriversData: TeamDriversData = {
  "Red Bull Racing": {
    drivers: [
      {
        name: "Max Verstappen",
        totalPoints: 1796.5,
        wins: 53,
        races: 95,
        pointsPerRace: 18.91
      },
      {
        name: "Sergio Perez",
        totalPoints: 846.0,
        wins: 5,
        races: 78,
        pointsPerRace: 10.85
      }
    ],
    color: "#3671C6"
  },
  "Mercedes": {
    drivers: [
      {
        name: "Lewis Hamilton",
        totalPoints: 1282.5,
        wins: 20,
        races: 94,
        pointsPerRace: 13.64
      },
      {
        name: "George Russell",
        totalPoints: 527.0,
        wins: 2,
        races: 57,
        pointsPerRace: 9.25
      }
    ],
    color: "#6CD3BF"
  },
  "Ferrari": {
    drivers: [
      {
        name: "Charles Leclerc",
        totalPoints: 869.0,
        wins: 4,
        races: 95,
        pointsPerRace: 9.15
      },
      {
        name: "Carlos Sainz",
        totalPoints: 703.5,
        wins: 3,
        races: 77,
        pointsPerRace: 9.14
      }
    ],
    color: "#F91536"
  },
  "McLaren": {
    drivers: [
      {
        name: "Lando Norris",
        totalPoints: 719.0,
        wins: 5,
        races: 95,
        pointsPerRace: 7.57
      },
      {
        name: "Oscar Piastri",
        totalPoints: 194.0,
        wins: 2,
        races: 34,
        pointsPerRace: 5.71
      }
    ],
    color: "#F58020"
  },
  "Aston Martin": {
    drivers: [
      {
        name: "Fernando Alonso",
        totalPoints: 405.0, // Combined his two periods
        wins: 0,
        races: 78, // Combined races
        pointsPerRace: 5.19 // Recalculated
      },
      {
        name: "Lance Stroll",
        totalPoints: 218.0, // Combined his entries
        wins: 0,
        races: 94,
        pointsPerRace: 2.32
      }
    ],
    color: "#358C75"
  },
  "Alpine": {
    drivers: [
      {
        name: "Esteban Ocon",
        totalPoints: 284.0, // Combined entries
        wins: 1,
        races: 95,
        pointsPerRace: 2.99
      },
      {
        name: "Pierre Gasly",
        totalPoints: 268.0, // Combined entries
        wins: 1,
        races: 95,
        pointsPerRace: 2.82
      }
    ],
    color: "#2293D1"
  },
  "Williams": {
    drivers: [
      {
        name: "Alexander Albon",
        totalPoints: 138.0, // Combined entries
        wins: 0,
        races: 72,
        pointsPerRace: 1.92
      },
      {
        name: "Logan Sargeant",
        totalPoints: 1.0,
        wins: 0,
        races: 33,
        pointsPerRace: 0.03
      }
    ],
    color: "#37BEDD"
  },
  "RB AlphaTauri": {
    drivers: [
      {
        name: "Liam Lawson",
        totalPoints: 6, // Combined all entries
        wins: 0,
        races: 11,
        pointsPerRace: 0.55
      },
      {
        name: "Yuki Tsunoda",
        totalPoints: 77.0, // Combined entries
        wins: 0,
        races: 78,
        pointsPerRace: 0.99
      }
    ],
    color: "#5E8FAA"
  },
  "Kick Sauber": {
    drivers: [
      {
        name: "Valtteri Bottas",
        totalPoints: 499.0, // Combined entries
        wins: 3,
        races: 95,
        pointsPerRace: 5.25
      },
      {
        name: "Zhou Guanyu",
        totalPoints: 12.0,
        wins: 0,
        races: 44,
        pointsPerRace: 0.27
      }
    ],
    color: "#00e701"
  },
  "Haas F1": {
    drivers: [
      {
        name: "Kevin Magnussen",
        totalPoints: 30.0,
        wins: 0,
        races: 73,
        pointsPerRace: 0.41
      },
      {
        name: "Nico Hulkenberg",
        totalPoints: 9.0,
        wins: 0,
        races: 61,
        pointsPerRace: 0.15
      }
    ],
    color: "#B6BABD"
  }
};

interface DriverComparisonProps {
  selectedTeam: string;
}

const DriverComparison: React.FC<DriverComparisonProps> = ({ selectedTeam }) => {
  const teamData = teamDriversData[selectedTeam];
  
  if (!teamData) return null;

  const createChartData = (metric: 'totalPoints' | 'wins' | 'races' | 'pointsPerRace') => ({
    labels: teamData.drivers.map(driver => driver.name.split(' ')[1]),
    datasets: [{
      data: teamData.drivers.map(driver => driver[metric]),
      backgroundColor: [
        `${teamData.color}FF`,
        `${teamData.color}99`
      ],
      borderColor: teamData.color,
      borderWidth: 1
    }]
  });

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { color: '#fff' }
      },
      x: {
        grid: {
          display: false
        },
        ticks: { color: '#fff' }
      }
    }
  };

  return (
    <div className="bg-black/20 p-4 rounded-lg">
      <h3 className="text-xl font-bold text-center mb-4" style={{ color: teamData.color }}>
        {selectedTeam} Driver Comparison (2020-2024)
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Total Points Chart */}
        <div className="h-[200px]">
          <h4 className="text-center text-white mb-2">Total Points</h4>
          <Bar 
            data={createChartData('totalPoints')} 
            options={{
              ...baseOptions,
              scales: {
                ...baseOptions.scales,
                y: {
                  ...baseOptions.scales.y,
                  title: {
                    display: true,
                    text: 'Points',
                    color: '#fff'
                  }
                }
              }
            }}
          />
        </div>

        {/* Wins Chart */}
        <div className="h-[200px]">
          <h4 className="text-center text-white mb-2">Race Wins</h4>
          <Bar 
            data={createChartData('wins')}
            options={{
              ...baseOptions,
              scales: {
                ...baseOptions.scales,
                y: {
                  ...baseOptions.scales.y,
                  title: {
                    display: true,
                    text: 'Wins',
                    color: '#fff'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Driver Stats Cards */}
      <div className="mt-12 grid grid-cols-2 gap-4">
        {teamData.drivers.map((driver) => (
          <div 
            key={driver.name}
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${teamData.color}22` }}
          >
            <h4 className="font-semibold text-lg mb-2" style={{ color: teamData.color }}>
              {driver.name}
            </h4>
            <div className="space-y-1 text-sm text-white">
              <p>Total Points: {driver.totalPoints}</p>
              <p>Wins: {driver.wins}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverComparison;
