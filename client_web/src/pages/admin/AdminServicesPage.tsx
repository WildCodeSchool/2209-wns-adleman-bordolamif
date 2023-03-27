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
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 nunito-bold text-3xl">Gérer mes services</h1>
        <div className="h-[2px] w-full bg-gray-300 mt-5" />
      </div>
      <div>
        <h2 className="nunito-bold text-xl mb-8">Créer un service</h2>
        <div className="flex items-center justify-start ml-8 mb-12 mx-4">
          <div className="flex flex-col items-center">
            {!isCreateService
        && (
          <button
            type="button"
            className="flex bg-green-600 nunito-bold text-white hover:bg-green-700 py-2 px-4 rounded-xl"
            onClick={() => setIsCreateService(true)}
          >
            <PlusCircleIcon className="w-6 mr-2 hover:animate-pulse" />
            Ajouter un service
          </button>
        )}
            {isCreateService
      && (
      <ServiceCreateForm
        setIsCreateService={setIsCreateService}
        handleCreateService={handleCreateService}
      />
      )}
          </div>
        </div>
        <h2 className="nunito-bold text-xl mb-8">Mes services</h2>
        <div className="px-8">
          <ServicesList
            servicesList={servicesList && servicesList.getAllServices}
            handleUpdateService={handleUpdateService}
            handleDeleteService={handleDeleteService}
            mode="details"
          />
          {servicesListLoading && <p>Chargement...</p>}
        </div>
      </div>
    </>
  );
}
export default AdminServicesPage;
