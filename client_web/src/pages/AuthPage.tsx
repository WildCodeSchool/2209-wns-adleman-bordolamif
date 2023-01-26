/* eslint-disable react/jsx-props-no-spreading */
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string,
  password: string,
};
function AuthPage() {
  const {
    register, handleSubmit,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => data;

  return (
    <div className="flex h-screen justify-center items-center bg-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <h1 className="mb-7">Connexion</h1>

          <input placeholder="email" {...register('email')} className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-7" />
          <input placeholder="password" {...register('password')} className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-7" />
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-3/6">Se connecter</button>
        </div>
      </form>
    </div>

  );
}

export default AuthPage;
