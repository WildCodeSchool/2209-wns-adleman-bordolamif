import { useMutation, useQuery } from '@apollo/client';
import ServiceCreateForm from '@components/forms/ServiceCreateForm';
import ServicesList from '@components/lists/ServicesList';
import { CREATE_SERVICE, DELETE_SERVICE, UPDATE_SERVICE } from '@graphQL/mutations/serviceMutations';
import { GET_ALL_SERVICES } from '@graphQL/query/serviceQuery';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { ServiceInput } from '@utils/types/InputTypes';
import { useState } from 'react';

function AdminServicesPage() {
  const {
    loading: servicesListLoading,
    data: servicesList,
    refetch: refetchServicesList,
  } = useQuery(GET_ALL_SERVICES);

  const [CreateService] = useMutation(CREATE_SERVICE);
  const [UpdateService] = useMutation(UPDATE_SERVICE);
  const [DeleteService] = useMutation(DELETE_SERVICE);

  const [isCreateService, setIsCreateService] = useState<boolean>(false);

  const handleCreateService = async (data:ServiceInput) => {
    await CreateService({ variables: { data } });
    refetchServicesList();
  };

  const handleUpdateService = async (valuesToUpdate:ServiceInput, updateServiceId: number) => {
    await UpdateService({ variables: { data: valuesToUpdate, updateServiceId } });
    refetchServicesList();
  };

  const handleDeleteService = async (id: number) => {
    await DeleteService({ variables: { deleteServiceId: id } });
    refetchServicesList();
  };

  return (
    <>
      <div className="f-title-format">
        <h1 className="f-main-title">Gérer mes services</h1>
        <div className="f-decoration-line" />
      </div>
      <p className="pl-6 text-lg">
        Vous pouvez ici ajouter, modifier ou supprimer
        les différents services liés à votre compte.
      </p>
      <div className="f-format-creation">
        <div className="f-format-adding">
          <h2 className="f-button-text-white">Créer un service</h2>
          <div className="flex flex-row ml-8 mb-4 mx-4">
            <div className="flex flex-col items-center">
              {!isCreateService
        && (
          <button
            type="button"
            className="f-button-orange"
            onClick={() => setIsCreateService(true)}
          >
            <PlusCircleIcon className="mr-2 w-7" />
            Ajouter un service
          </button>
        )}
            </div>
          </div>
          {isCreateService
      && (
      <ServiceCreateForm
        setIsCreateService={setIsCreateService}
        handleCreateService={handleCreateService}
      />
      )}
        </div>

      </div>
      <h2 className="f-title-for-list">Mes services</h2>
      <div className="px-8">
        <ServicesList
          servicesList={servicesList && servicesList.getAllServices}
          handleUpdateService={handleUpdateService}
          handleDeleteService={handleDeleteService}
          mode="details"
        />
        {servicesListLoading && <p>Chargement...</p>}
      </div>
    </>
  );
}
export default AdminServicesPage;
