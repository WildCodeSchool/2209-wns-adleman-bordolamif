import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@graphQL/mutations/userMutations';
import { useState } from 'react';
import { UserInput } from 'src/utils/types/inputTypes';

function CreateUser() {
  const { register, handleSubmit } = useForm<UserInput>();
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [error, setError] = useState('');

  const onCreateUser = async (data: UserInput) => {
    try {
      await createUser({ variables: { data } });
    } catch (e) {
      setError('Error while trying to create user');
    }
  };

  return (
    <div className="flex h-full justify-center items-center">
      <form onSubmit={handleSubmit(onCreateUser)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <h1 className="mb-7 text-gray-700">Créer un nouvel opérateur</h1>
          <input placeholder="First Name" {...register('firstname')} className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7" />
          <input placeholder="Last Name" {...register('lastname')} className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7" />
          <input placeholder="email" {...register('email')} className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7" />
          <input placeholder="password" {...register('password')} className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none mb-7" />
          <button type="submit" className="shadow bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-3/6">Activer le compte</button>
          <div>
            {loading && <div>Submitting ...</div>}
            {error && <div>{error}</div>}
          </div>
        </div>
      </form>
    </div>

  );
}

export default CreateUser;