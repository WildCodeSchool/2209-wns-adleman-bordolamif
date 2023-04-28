import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

  interface Props {
    chartData: {
      date: string,
      ticketsNb: number
    }[]
  }

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);
function TicketsPerDayChart(props: Props) {
  const { chartData } = props;

  const data = {
    labels: chartData.map((element) => element.date),
    datasets: [{
      fill: true,
      responsive: true,
      label: 'Tickets de la journée',
      data: chartData.map((element) => element.ticketsNb),
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
    }],
  };

  const options = {
    responsive: true,
  };

  return <Line data={data} options={options} />;
}

export default TicketsPerDayChart;
