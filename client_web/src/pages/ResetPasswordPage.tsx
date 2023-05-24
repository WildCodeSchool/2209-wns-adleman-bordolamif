import { useMutation } from '@apollo/client';
import ChangePasswordForm from '@components/forms/ChangePasswordForm';
import { RESET_PASSWORD } from '@graphQL/mutations/userMutations';
import { ChangePassword } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

function ResetPasswordPage() {
  const { uuid } = useParams();

  const [error, setError] = useState<string | null>(null);

  const [resetPassword, { data }] = useMutation(RESET_PASSWORD);

  const onChangePassword = async (formData: ChangePassword) => {
    const { newPassword, checkPassword } = formData;
    try {
      if (newPassword === checkPassword) {
        await resetPassword({
          variables: {
            password: newPassword, uuid,
          },

        });
      } else {
        setError('Mot de passe different');
      }
    } catch (e) {
      setError('Votre nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
  };
  return (
    <div className="flex justify-center items-center bg-gray-200 min-h-screen">
      <div className="flex flex-col justify-center items-center bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 h-fit">
        {data === undefined && (
        <><h2 className="mb-6">Veuillez renseigner votre nouveau mot de passe</h2>
          <ChangePasswordForm onChangePassword={onChangePassword} error={error} />
        </>
        )}
        {data && (
        <>
          <p>{data.resetPassword}</p>
          <Link to="/" className="flex justify-around drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-2/6 cursor-pointer mt-5">Ok</Link>
        </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
