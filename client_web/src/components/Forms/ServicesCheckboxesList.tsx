import { Service } from '@utils/types/DataTypes';
import { ServiceId } from '@utils/types/InputIdTypes';

interface Props {
checkList : ServiceId[],
servicesList : Service[] | null
toggleCheckList: (id: number) => void;
}

function ServicesCheckboxesList(props: Props) {
  const { checkList, servicesList, toggleCheckList } = props;
  return (
    <div>
      {servicesList && servicesList.map((service: Service) => (
        <label key={service.id}>
          <input type="checkbox" value={service.id} name={service.name} checked={!!checkList.find((serv) => serv.id === service.id)} onChange={() => toggleCheckList(service.id)} />
          {service.name}
        </label>
      ))}
    </div>

  );
}

export default ServicesCheckboxesList;
