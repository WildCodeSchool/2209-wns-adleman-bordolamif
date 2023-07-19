import ServiceCard from '@components/cards/ServiceCard';
import ServiceIcon from '@components/icons/ServiceIcon';
import { ServiceData, TicketData } from '@utils/types/DataTypes';
import { ServiceInput } from '@utils/types/InputTypes';
import ServiceDetails from '../details/ServiceDetails';

interface RequiredProps {
    servicesList: ServiceData[],
    mode: string
  }

  interface OptionalProps{
    handleUpdateService?: null | ((data: ServiceInput, id: number) => void)
    handleDeleteService?: null | ((id: number) => void)
    handleOpenModal?: null| ((service: ServiceData) => void)
    ticketsList?: null | TicketData[]
  }

  interface Props extends RequiredProps, OptionalProps{}

const defaultProps: OptionalProps = {
  handleDeleteService: null,
  handleUpdateService: null,
  handleOpenModal: null,
  ticketsList: null,
};

function ServicesList(props:Props) {
  const {
    servicesList, handleUpdateService, handleDeleteService, handleOpenModal, mode, ticketsList,
  } = props;

  return (
    <div className="grid grid-cols-3 gap-8 mx-10 mt-8">
      {servicesList && servicesList!
      && (
        (mode === 'details' && handleDeleteService && handleUpdateService && servicesList.map((service) => (
          <ServiceDetails
            handleUpdateService={handleUpdateService}
            handleDeleteService={handleDeleteService}
            key={service.id}
            service={service}
          />
        )))
        || (mode === 'icons' && servicesList.map((service) => (
          <ServiceIcon
            key={service.id}
            service={service}
          />
        )))
        || (mode === 'cards' && handleOpenModal && servicesList.map((service) => (
          <ServiceCard
            ticketsList={ticketsList!}
            handleOpenModal={handleOpenModal}
            key={service.id}
            service={service}
          />
        )))
      )}
    </div>
  );
}

ServicesList.defaultProps = defaultProps;

export default ServicesList;
