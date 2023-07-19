import { UserData } from '@utils/types/DataTypes';

interface Props {
    user: UserData,
    handleOpenModal: (user:UserData | null) => void
    handleUpdateUserSuspension: (data: boolean, id: number) => void
    handleDeleteUser: (id:number) => void
}

function UserDetails(props: Props) {
  const {
    user, handleOpenModal, handleUpdateUserSuspension, handleDeleteUser,
  } = props;

  return (
    <div className="grid grid-cols-6 items-center mb-4">
      <p className="text-xl nunito-bold">{user.firstname}</p>
      <p className="text-xl nunito-bold">{user.lastname}</p>
      <p className="text-sm">{user.email}</p>
      <button
        type="button"
        onClick={() => handleUpdateUserSuspension(!user.isSuspended, user.id)}
        className="nunito-bold cursor-pointer ml-10 bg-gray-100 hover:bg-gray-200 drop-shadow p-2 rounded-2xl"
      >
        Suspendu : {user.isSuspended ? '✅' : '❌'}
      </button>
      <button
        type="button"
        onClick={() => handleOpenModal(user)}
        className="f-button-green ml-16"
      >
        Modifier
      </button>
      <button
        type="button"
        onClick={() => handleDeleteUser(user.id)}
        className="f-button-red ml-8"
      >
        Supprimer
      </button>
    </div>
  );
}

export default UserDetails;
