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
    <div className="flex flex-row justify-between mb-2">
      <p>{user.firstname}</p>
      <p>{user.lastname}</p>
      <p>{user.email}</p>
      <button
        type="button"
        onClick={() => handleUpdateUserSuspension(!user.isSuspended, user.id)}
        className={user.isSuspended ? 'f-button-red' : 'f-button-green'}
      >Suspendu: {user.isSuspended ? 'oui' : 'non'}
      </button>
      <button
        type="button"
        onClick={() => handleOpenModal(user)}
        className="f-button-green"
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
