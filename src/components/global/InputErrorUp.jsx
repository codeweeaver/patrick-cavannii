import { InputError } from './InputError';

const InputErrorUp = ({ isError, label, message }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold capitalize">{label}</label>
      {isError && <InputError message={message} />}
    </div>
  );
};

export default InputErrorUp;
