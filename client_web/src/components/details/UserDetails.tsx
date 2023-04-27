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
      <p className="">{user.email}</p>
      <button
        type="button"
        onClick={() => handleUpdateUserSuspension(!user.isSuspended, user.id)}
        className="nunito-bold cursor-pointer"
      >
        Suspendu : {user.isSuspended ? 'oui' : 'non'}
      </button>
      <button
        type="button"
        onClick={() => handleOpenModal(user)}
        className="f-button-green ml-8"
      >
        Modifier
      </button>
      <button
        type="button"
        onClick={() => handleDeleteUser(user.id)}
        className="f-button-red"
      >
        Supprimer
      </button>
    </div>
  );
}

export default UserDetails;
