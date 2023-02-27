import { UserData } from '@utils/types/DataTypes';
import UserDetails from '../1/UserDetails';

interface Props {
    usersList: [UserData],
    handleOpenModal: (user:UserData | null) => void
    handleDeleteUser: (id:number) => void
}

function UsersList(props:Props) {
  const { usersList, handleOpenModal, handleDeleteUser } = props;
  return (
    <div>
      {usersList! && usersList.map((user) => (
        <UserDetails
          key={user.id}
          user={user}
          handleOpenModal={handleOpenModal}
          handleDeleteUser={handleDeleteUser}
        />
      ))}
    </div>
  );
}

export default UsersList;
