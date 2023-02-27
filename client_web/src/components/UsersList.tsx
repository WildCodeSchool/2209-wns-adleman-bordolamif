import { UserData } from '@utils/types/DataTypes';
import UserDetails from './UserDetails';

interface Props {
    usersList: [UserData],
    handleOpenModal: (user:UserData | null) => void
    handleDelete: (id:number) => void
}

function UsersList(props:Props) {
  const { usersList, handleOpenModal, handleDelete } = props;
  return (
    <div>
      {usersList! && usersList.map((user) => (
        <UserDetails
          key={user.id}
          user={user}
          handleOpenModal={handleOpenModal}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default UsersList;
