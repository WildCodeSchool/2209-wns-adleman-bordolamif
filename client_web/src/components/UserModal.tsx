import { UserData } from '@utils/types/DataTypes';
import UserForm from './Forms/UserForm';

interface Props {
    userToUpdate: UserData | null;
    isModalOpen : boolean;
    handleCloseModal: () => void;
}

function UserModal(props: Props) {
  const { userToUpdate, isModalOpen, handleCloseModal } = props;
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
          handleCloseModal={handleCloseModal}

        />
      </div>
    </div>
  );
}

export default UserModal;
