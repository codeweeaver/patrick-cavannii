import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import FormGroup from '../components/forms/FormGroup';

export const SelectInput = ({ name, options, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup label={props.label} error={errors[name]} id={name}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            classNamePrefix="lux-select"
            unstyled
            classNames={{
              control: ({ isFocused }) =>
                `min-h-[3rem] w-full rounded-xl border bg-white px-3 text-sm shadow-sm transition-all duration-300 outline-none ${
                  errors[name]
                    ? 'border-red-500 ring-2 ring-red-500/10'
                    : isFocused
                      ? 'border-primary ring-4 ring-primary/10'
                      : 'border-gray-100 hover:border-gray-200'
                }`,
              option: ({ isFocused, isSelected }) =>
                `cursor-pointer px-4 py-2 text-sm transition-colors ${
                  isSelected
                    ? 'bg-primary text-white'
                    : isFocused
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600'
                }`,
              menu: () =>
                'mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg',
              placeholder: () => 'text-gray-300',
              singleValue: () => 'text-gray-700',
            }}
          />
        )}
      />
    </FormGroup>
  );
};
