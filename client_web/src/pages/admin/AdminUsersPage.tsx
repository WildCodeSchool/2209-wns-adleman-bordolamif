import { useMutation, useQuery } from '@apollo/client';
import UserModal from '@components/modals/UserModal';
import UsersList from '@components/lists/UsersList';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '@graphQL/mutations/userMutations';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import useModal from '@utils/hooks/UseModal';
import { UserData } from '@utils/types/DataTypes';
import { useState } from 'react';
import { UserInput } from '@utils/types/InputTypes';

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
      <h1>UsersPage</h1>
      {usersListLoading && <p>loading...</p>}
      <UsersList
        usersList={usersList && usersList.getAllUsers}
        handleOpenModal={handleOpenModal}
        handleDeleteUser={handleDeleteUser}
      />
      <button
        type="button"
        onClick={() => handleOpenModal(null)}
        className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-3/6"
      >
        Create User
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
