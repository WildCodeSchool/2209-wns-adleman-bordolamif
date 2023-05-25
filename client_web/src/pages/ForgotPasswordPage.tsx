import { useForm } from 'react-hook-form';
import { AtSymbolIcon } from '@heroicons/react/24/solid';
import { Email } from '@utils/types/InputTypes';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '@graphQL/mutations/userMutations';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [ForgotPassword, { data, loading, error }] = useMutation(FORGOT_PASSWORD);
  const [emailValue, setEmailValue] = useState('');
  const {
    reset, register, handleSubmit, formState: { errors },
  } = useForm<Email>();

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setEmailValue(newValue);
  };

  const onSubmit = async (formData: Email) => {
    await ForgotPassword({ variables: formData });
    reset();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center bg-white p-5 rounded-lg max-w-md">
          {error === undefined && data === undefined && (
          <>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 nunito-bold text-3xl mb-8">
              Mot de passe oublié ?
            </h2>
            <p className="text-gray-700 px-10">Vous recevrez d'ici peu un email vous permettant
              de réinitialiser votre mot de passe
            </p>
            <div className="relative mt-8">
              <AtSymbolIcon className="f-auth-icon" />
              <input
                type="email"
                placeholder="Email"
                {...register('email', {
                  onChange: handleChangeEmail,
                  value: emailValue,
                  required: true,
                })}
                className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
              />
            </div>
            {errors.email?.type === 'required' && <p className="text-red-500 mb-5">L'email est obligatoire</p>}

            <button
              type="submit"
              disabled={emailValue === '' || errors.email?.type === 'required' || loading}
              className="drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-1/3 cursor-pointer"
            >
              Valider
            </button>
          </>
          )}
          {error?.message === 'User not found' && (<div>Nous n'avons pas trouvé de compte associé à cet email</div>)}
          {data && data.forgotPassword && (
          <>
            <p className="text-gray-700 text-center">{data.forgotPassword}</p>
            <Link to="/" className="flex justify-around drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-2/6 cursor-pointer mt-5">Ok</Link>
          </>
          )}
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
