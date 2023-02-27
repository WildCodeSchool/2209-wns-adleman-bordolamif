import { UserData } from '@utils/types/DataTypes';
import { UserInput } from '@utils/types/InputTypes';
import UserForm from '../forms/UserForm';

interface Props {
    userToUpdate: UserData | null;
    isModalOpen : boolean;
    handleCloseModal: () => void;
    handleCreateUser: (data:UserInput) => void
    handleUpdateUser: (data:UserInput, id:number) => void
}

function UserModal(props: Props) {
  const {
    userToUpdate, isModalOpen, handleCloseModal, handleCreateUser, handleUpdateUser,
  } = props;
  return (
    <div
      className={
        isModalOpen
          ? 'absolute inset-0 m-12 filter backdrop-blur-sm m-auto z-10 flex flex-col items-center justify-center'
          : 'hidden'
      }
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <div className="mb-7 text-gray-700 flex justify-between">
          <h2>{userToUpdate ? 'Edition' : 'Création'} d'utilisateur</h2>
          <button type="button" className="font-bold" onClick={() => handleCloseModal()}>
            X
          </button>
        </div>

        <UserForm
          userToUpdate={userToUpdate}
          handleCreateUser={handleCreateUser}
          handleUpdateUser={handleUpdateUser}
          handleCloseModal={handleCloseModal}

        />
      </div>
    </div>
  );
}

export default UserModal;
