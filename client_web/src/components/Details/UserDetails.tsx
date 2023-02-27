import { UserData } from '@utils/types/DataTypes';

interface Props {
    user: UserData,
    handleOpenModal: (user:UserData | null) => void
    handleDeleteUser: (id:number) => void
}

function UserDetails(props: Props) {
  const { user, handleOpenModal, handleDeleteUser } = props;

  return (
    <div className="flex flex-row justify-between">
      <p>{user.firstname}</p>
      <p>{user.lastname}</p>
      <p>{user.email}</p>
      <button
        type="button"
        onClick={() => handleOpenModal(user)}
        className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >UPDATE
      </button>
      <button
        type="button"
        onClick={() => handleDeleteUser(user.id)}
        className="shadow bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
      >DELETE
      </button>
    </div>
  );
}

export default UserDetails;
