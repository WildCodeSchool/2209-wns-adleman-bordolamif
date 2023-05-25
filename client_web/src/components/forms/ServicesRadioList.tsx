import ServiceIcon from '@components/icons/ServiceIcon';
import { ServiceData } from '@utils/types/DataTypes';

interface Props {
radioChecked : ServiceData | undefined,
servicesList : ServiceData[] | null
toggleRadioList: (service: ServiceData) => void;
}

function ServicesRadioList(props: Props) {
  const { radioChecked, servicesList, toggleRadioList } = props;
  return (
    <div className="grid grid-cols-3">
      {servicesList && servicesList.map((service: ServiceData) => (
        <label key={service.id} className="flex flex-row gap-1 items-center p-2">
          <input
            className="mr-2 ml-10"
            type="radio"
            value={service.id}
            name={service.name}
            checked={radioChecked?.id === service.id}
            onChange={() => toggleRadioList(service)}
          /><ServiceIcon service={service} />{service.name}
        </label>
      ))}
    </div>

  );
}

export default ServicesRadioList;
