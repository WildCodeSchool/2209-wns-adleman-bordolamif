import { useQuery } from '@apollo/client';
import DateTimePicker from '@components/utils/DateTimePicker';
import { GET_ALL_TICKETS } from '@graphQL/query/ticketQuery';

function AdminStatistics() {
  return (
    <div>
      <DateTimePicker />

    </div>

  );
}
export default AdminStatistics;
