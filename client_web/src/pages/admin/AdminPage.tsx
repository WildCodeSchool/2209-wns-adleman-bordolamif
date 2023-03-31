import { useQuery } from '@apollo/client';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { ServiceData } from '@utils/types/DataTypes';
import { useState } from 'react';

function AdminPage() {
  const [serviceFilter, setServiceFilter] = useState<string>('');

  const {
    data: servicesList,
  } = useQuery(GET_ALL_SERVICES);

  const filterServices = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h1 className="f-main-title">Tableau de bord</h1>
        <div className="f-decoration-line" />
      </div>
      <div>
        <select name="services" onChange={filterServices} className="border-2 p-2 rounded-xl hover:bg-gray-100">
          <option value="">Filtrer par service</option>
          {servicesList && servicesList!
        && servicesList.getAllServices.map((service: ServiceData) => (
          <option key={service.id} value={service.name}>{service.name}</option>
        ))}
        </select>
      </div>
    </div>
  );
}
export default AdminPage;
