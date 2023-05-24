import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface Props {
  chartData: {
    name: string,
    color: string,
    ticketsNb: number
  }[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

function TicketsByServicesChart(props: Props) {
  const { chartData } = props;

  const data = {
    labels: chartData.map((element) => element.name),
    datasets: [{
      label: ' Tickets de la journée ',
      data: chartData.map((element) => element.ticketsNb),
      backgroundColor: chartData.map((element) => element.color),
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default TicketsByServicesChart;
