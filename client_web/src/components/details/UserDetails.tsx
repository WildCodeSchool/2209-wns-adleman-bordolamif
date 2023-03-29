import { UserData } from '@utils/types/DataTypes';

interface Props {
    user: UserData,
    handleOpenModal: (user:UserData | null) => void
    handleDeleteUser: (id:number) => void
}

function UserDetails(props: Props) {
  const { user, handleOpenModal, handleDeleteUser } = props;

  return (
    <div className="flex flex-row justify-between mb-2">
      <p>{user.firstname}</p>
      <p>{user.lastname}</p>
      <p>{user.email}</p>
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
