import { useMutation, useQuery } from '@apollo/client';
import UserModal from '@components/modals/UserModal';
import UsersList from '@components/lists/UsersList';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '@graphQL/mutations/userMutations';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import useModal from '@utils/hooks/UseModal';
import { UserData } from '@utils/types/DataTypes';
import { useState } from 'react';
import { UserInput } from '@utils/types/InputTypes';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

function AdminUsersPage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  const [userToUpdate, setUserToUpdate] = useState<UserData | null>(null);
  const [CreateUser] = useMutation(CREATE_USER);
  const [UpdateUser] = useMutation(UPDATE_USER);
  const [DeleteUser] = useMutation(DELETE_USER);
  const {
    loading: usersListLoading,
    data: usersList,
    refetch: refetchUserList,
  } = useQuery(GET_ALL_USERS);

  const handleDeleteUser = async (id:number) => {
    await DeleteUser({ variables: { deleteUserId: id } });
    await refetchUserList();
  };

  const handleCreateUser = async (data:UserInput) => {
    await CreateUser({ variables: { data } });
    await refetchUserList();
  };

  const handleUpdateUser = async (data:UserInput, id:number) => {
    await UpdateUser({ variables: { data, updateUserId: id } });
    await refetchUserList();
  };

  const handleOpenModal = (user: UserData | null) => {
    setUserToUpdate(user);
    openModal();
  };

  const handleCloseModal = () => {
    setUserToUpdate(null);
    closeModal();
  };
  return (
    <div>
      <div className="flex flex-col items-center mb-12">
        <h1 className="f-main-title">Opérateurs</h1>
        <div className="h-[2px] w-full bg-gray-300 mt-5" />
      </div>
      {usersListLoading && <p>loading...</p>}
      <UsersList
        usersList={usersList && usersList.getAllUsers}
        handleOpenModal={handleOpenModal}
        handleDeleteUser={handleDeleteUser}
      />
      <button
        type="button"
        onClick={() => handleOpenModal(null)}
        className="f-button-green"
      >
        <PlusCircleIcon className="w-6 mr-2 hover:animate-pulse" />
        Ajouter un opérateur
      </button>
      <UserModal
        userToUpdate={userToUpdate}
        isModalOpen={isModalOpen}
        handleCreateUser={handleCreateUser}
        handleUpdateUser={handleUpdateUser}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}
export default AdminUsersPage;
