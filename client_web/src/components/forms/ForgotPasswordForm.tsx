import { useForm } from 'react-hook-form';
import { AtSymbolIcon } from '@heroicons/react/24/solid';

function ForgotPasswordForm() {
  const {
    reset, register, handleSubmit,
  } = useForm();

  const onSubmit = () => {
    sendEmail();
    reset();
  };

  const sendEmail = () => {
    // Todo
  };

  return (
    <div className="bg-red-500 min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center bg-blue-500">
          <div className="relative">
            <AtSymbolIcon className="f-auth-icon" />
            <input
              placeholder="Email"
              {...register('email')}
              // , {
              //   onChange: handleChangeEmail,
              //   value: emailValue,
              // }
              className="border rounded w-[20rem] py-2 pl-10 text-gray-700 focus:outline-none mb-7"
            />
          </div>

          <button
            type="submit"
          // disabled={}
            className="drop-shadow disabled:cursor-default transition-all hover:bg-orange-600 duration-500 disabled:bg-gray-300 bg-orange-500 text-white py-2 px-4 rounded w-1/3 cursor-pointer"
          >
            Valider
          </button>
          {/* {error && <div className="f-error-message w-80 mt-4 text-sm">{error}</div>} */}
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
