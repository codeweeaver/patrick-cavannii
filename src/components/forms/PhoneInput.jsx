import { Controller, useFormContext } from 'react-hook-form';
import { PhoneInput as InternationalPhone } from 'react-international-phone';
import 'react-international-phone/style.css';
import { FormGroup } from './FormGroup';

export const PhoneInput = ({ name, label, country, icon, errorClass, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <FormGroup label={label} error={error} icon={icon} id={name} errorClass={errorClass}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          /* Note: We removed overflow-hidden from here because it clips
             the country dropdown. Instead, we use a high relative z-index.
          */
          <div
            className={`luxury-phone-wrapper relative z-40 rounded-xl border bg-white transition-all duration-300 ${
              error
                ? 'border-red-500 ring-2 ring-red-500/10'
                : 'border-gray-100 focus-within:border-black focus-within:ring-4 focus-within:ring-black/5'
            }`}
          >
            <InternationalPhone
              {...field}
              defaultCountry={country?.toLowerCase() || 'us'}
              inputClassName="!border-0 !bg-transparent !w-full !text-sm !h-[46px] !px-3 outline-none"
              countrySelectorStyleProps={{
                buttonClassName:
                  '!border-0 !bg-transparent !h-[46px] !px-3 hover:!bg-gray-50 !rounded-l-xl',
                // This targets the actual dropdown list container
                dropdownMenuClassName:
                  '!z-[9999] !bg-white !shadow-2xl !border !border-gray-100 !rounded-lg',
                dropdownMenuListItemClassName: 'hover:!bg-gray-50',
              }}
              {...props}
            />
          </div>
        )}
      />
    </FormGroup>
  );
};
