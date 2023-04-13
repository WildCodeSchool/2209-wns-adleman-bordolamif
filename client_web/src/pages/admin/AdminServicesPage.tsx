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
      <div className="flex flex-row items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-3 w-1/2">
          <h2 className="text-white text-3xl ml-6 mb-4 mt-1">Créer un service</h2>
          <div className="flex flex-row ml-8 mb-4 mx-4">
            <div className="flex flex-col items-center">
              {!isCreateService
        && (
          <button
            type="button"
            className="flex flex-row ml-4 p-3 rounded-2xl bg-white text-xl text-orange-500 hover:text-orange-600 hover:bg-gray-100 drop-shadow"
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
        <div>
          <h3 className="pl-8 text-2xl mb-4 nunito-bold">
            Bienvenue sur votre espace de gestion des services.
          </h3>
          <p className="pl-8 text-xl">
            Vous pouvez ici ajouter, modifier ou supprimer
            les différents services liés à votre compte.
          </p>
        </div>
      </div>
      <h2 className="text-3xl ml-6 mb-8">Mes services</h2>
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
