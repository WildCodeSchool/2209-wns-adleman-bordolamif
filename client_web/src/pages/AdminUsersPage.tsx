import { useMutation, useQuery } from '@apollo/client';
import UserModal from '@components/UserModal';
import UsersList from '@components/Lists/UsersList';
import { DELETE_USER } from '@graphQL/mutations/userMutations';
import { GET_ALL_USERS } from '@graphQL/query/userQuery';
import useModal from '@utils/hooks/UseModal';
import { UserData } from '@utils/types/DataTypes';
import { useState } from 'react';

function AdminUsersPage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  const [userToUpdate, setUserToUpdate] = useState<UserData | null>(null);
  const [DeleteUser] = useMutation(DELETE_USER);
  const {
    loading: usersListLoading,
    data: usersList,
    refetch: refetchUserList,
  } = useQuery(GET_ALL_USERS);

  const handleDelete = async (id:number) => {
    await DeleteUser({ variables: { deleteUserId: id } });
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
        handleDelete={handleDelete}
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
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}
export default AdminUsersPage;
