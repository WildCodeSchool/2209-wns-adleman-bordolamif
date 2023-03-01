import { useQuery } from '@apollo/client';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';

function ClientPage() {
  const {
    // loading: servicesListLoading,
    data: servicesList,
    // refetch: refetchServicesList,
  } = useQuery(GET_ALL_SERVICES);

  return (
    <div>
      <p>Client</p>
      {servicesList && servicesList.getAllServices.map()}
    </div>

  );
}
export default ClientPage;
