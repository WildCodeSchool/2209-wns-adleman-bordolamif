import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

  interface Props {
    chartData: {
      name: string,
      color: string,
      waitingTime: number
    }[]
  }

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function AverageWaitingTimePerService(props: Props) {
  const { chartData } = props;

  const data = {
    labels: chartData.map((element) => element.name),
    datasets: [{
      label: "Temps d'attente moyen",
      data: chartData.map((element) => element.waitingTime),
      backgroundColor: chartData.map((element) => element.color),
    }],
  };

  const options = {
    responsive: true,
  };

  return <Bar data={data} options={options} />;
}

export default AverageWaitingTimePerService;
