import { UserData } from '@utils/types/DataTypes';
import UserDetails from '../details/UserDetails';

interface Props {
    usersList: [UserData],
    handleOpenModal: (user:UserData | null) => void
    handleUpdateUserSuspension: (data: boolean, id: number) => void
    handleDeleteUser: (id:number) => void
}

function UsersList(props:Props) {
  const {
    usersList, handleOpenModal, handleUpdateUserSuspension, handleDeleteUser,
  } = props;
  return (
    <div>
      {usersList! && usersList.map((user) => (
        user.role === 2
        && (
        <UserDetails
          key={user.id}
          user={user}
          handleOpenModal={handleOpenModal}
          handleUpdateUserSuspension={handleUpdateUserSuspension}
          handleDeleteUser={handleDeleteUser}
        />
        )
      ))}
    </div>
  );
}

export default UsersList;
