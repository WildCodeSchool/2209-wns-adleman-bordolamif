import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface Props {
  chartData: {
    name: string,
    color: string,
    waitingTickets: number
  }[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

function WaitingTicketsByServicesChart(props: Props) {
  const { chartData } = props;

  const data = {
    labels: chartData.map((element) => element.name),
    datasets: [{
      label: 'Tickets en attente',
      data: chartData.map((element) => element.waitingTickets),
      backgroundColor: chartData.map((element) => element.color),
    }],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default WaitingTicketsByServicesChart;
