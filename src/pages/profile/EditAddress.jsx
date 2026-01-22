import { yupResolver } from '@hookform/resolvers/yup';
import { City, State } from 'country-state-city';
import { motion } from 'framer-motion';
import parsePhoneNumber from 'libphonenumber-js';
import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiArrowLeftCircle, FiChevronDown, FiFlag, FiHelpCircle, FiMap } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import countryList from 'react-select-country-list';
import InputErrorUp from '../../components/global/InputErrorUp';
import { useAuth } from '../../hooks/useAuth';
import { locationSchema } from '../../schema/locationSchema';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Simple helper for tailwind classes to keep the JSX clean
const inputClasses = (error) => `
  w-full px-4 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
  ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}
  disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none
`;

const EditAddress = () => {
  const { user, updateUser } = useAuth();
  const { addressId } = useParams(); // Fixed: useParams is a hook, call it.
  const navigate = useNavigate();

  // 1. Identify if we are editing or creating
  const existingAddress = useMemo(() => {
    return addressId ? user?.addressess?.find((addr) => addr.id === addressId) : null;
  }, [addressId, user?.addressess]);

  // 2. Setup initial data and lock logic
  const defaultValues = useMemo(() => {
    if (existingAddress) {
      const countryCode =
        countryList().getValue(existingAddress.country) || existingAddress.country;
      const stateObj = State.getStatesOfCountry(countryCode).find(
        (s) => s.name === existingAddress.state || s.isoCode === existingAddress.state,
      );

      return {
        street: existingAddress.street || '',
        city: existingAddress.city || '',
        zipCode: existingAddress.zipCode || '',
        country: countryCode,
        state: stateObj ? stateObj.isoCode : '',
        label: existingAddress.label || '',
      };
    }

    // Default country detection from phone
    let countryDetect = user.country || '';
    if (user.phone) {
      try {
        const phone = parsePhoneNumber(user.phone);
        if (phone?.country) countryDetect = phone.country;
      } catch (e) {
        console.error(e);
      }
    }

    return { street: '', city: '', zipCode: '', country: countryDetect, state: '', label: '' };
  }, [existingAddress, user]);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(locationSchema),
    mode: 'onChange',
  });

  const {
    control,
    setValue,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  // Sync form when defaults change (e.g. data finishes loading)
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchedCountry = useWatch({ control, name: 'country' });
  const watchedState = useWatch({ control, name: 'state' });
  const previousCountry = useRef(watchedCountry);
  const previousState = useRef(watchedState);

  // 3. Dynamic Select Options
  const stateOptions = useMemo(
    () =>
      watchedCountry
        ? State.getStatesOfCountry(watchedCountry).map((s) => ({ value: s.isoCode, label: s.name }))
        : [],
    [watchedCountry],
  );

  const cityOptions = useMemo(
    () =>
      watchedCountry && watchedState
        ? City.getCitiesOfState(watchedCountry, watchedState).map((c) => ({
            value: c.name,
            label: c.name,
          }))
        : [],
    [watchedCountry, watchedState],
  );

  // 4. Cascading resets
  useEffect(() => {
    if (watchedCountry !== previousCountry.current) {
      if (previousCountry.current !== undefined) {
        setValue('state', '');
        setValue('city', '');
      }
      previousCountry.current = watchedCountry;
    }
  }, [watchedCountry, setValue]);

  useEffect(() => {
    if (watchedState !== previousState.current) {
      if (previousState.current !== undefined) setValue('city', '');
      previousState.current = watchedState;
    }
  }, [watchedState, setValue]);

  // 5. Submit Handler
  const onSubmit = async (data) => {
    try {
      const countryLabel = countryList().getLabel(data.country) || data.country;
      const stateLabel =
        State.getStateByCodeAndCountry(data.state, data.country)?.name || data.state;

      const payload = {
        ...data,
        country: countryLabel,
        state: stateLabel,
        id: addressId || crypto.randomUUID(),
      };

      const isDuplicate = user.addressess?.some(
        (a) => a.label === data.label && a.id !== addressId,
      );
      if (isDuplicate) return toast.error(`Label "${data.label}" already exists.`);

      let updatedList = [...(user.addressess || [])];
      if (addressId) {
        updatedList = updatedList.map((a) => (a.id === addressId ? { ...a, ...payload } : a));
      } else {
        updatedList.push({ ...payload, isDefault: updatedList.length === 0 });
      }
      updatedList = (user.addressess || []).map((addr) => {
        if (addr.id === addressId) {
          return {
            ...addr,
            ...data,
            country: countryLabel,
            state: stateLabel,
          };
        }
        return addr;
      });

      await updateUser(user.id, { ...user, addressess: updatedList });
      toast.success(addressId ? 'Address updated.' : 'Address added.');
      toast.success('Address updated.');
      navigate('/profile/address');
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <>
      <header className="mb-8 flex items-center gap-3">
        <Link to="/profile/address">
          <FiArrowLeftCircle className="h-6 w-6 cursor-pointer" />
        </Link>
        <h2>{addressId ? 'Edit Address' : 'Add New Address'}</h2>
        <h2>Edit Address</h2>
        <div className="ml-auto cursor-pointer">
          <FiHelpCircle className="text-primary h-6 w-6" title="Maximum of 3 addresses" />
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Country Select */}
            <motion.div variants={itemVariants} className="space-y-1">
              <InputErrorUp
                isError={errors.country}
                message={errors.country?.message}
                label="country"
              />
              <div className="relative">
                <select
                  {...register('country')}
                  disabled={!!addressId}
                  className={inputClasses(errors.country)}
                >
                  <option value="">Select Country</option>
                  {countryList()
                    .getData()
                    .map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <FiChevronDown />
                </div>
              </div>
            </motion.div>

            {/* Street Input */}
            <motion.div variants={itemVariants} className="space-y-1">
              <InputErrorUp isError={errors.street} message={errors.street?.message} label="street" />
              <div className="relative">
                <FiMap className="absolute top-3 left-3 text-gray-400" />
                <input
                  {...register('street')}
                  placeholder="123 Main St"
                  className={`${inputClasses(errors.street)} pl-10`}
                />
              </div>
            </motion.div>

            {/* State Select */}
            <motion.div variants={itemVariants} className="space-y-1">
              <InputErrorUp isError={errors.state} message={errors.state?.message} label="state" />
              <div className="relative">
                <select
                  {...register('state')}
                  disabled={!watchedCountry}
                  className={inputClasses(errors.state)}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <FiChevronDown />
                </div>
              </div>
            </motion.div>

            {/* Zip Code Input */}
            <motion.div variants={itemVariants} className="space-y-1">
              <InputErrorUp
                isError={errors.zipCode}
                message={errors.zipCode?.message}
                label="zip code"
              />
              <div className="relative">
                <FiFlag className="absolute top-3 left-3 text-gray-400" />
                <input
                  {...register('zipCode')}
                  placeholder="100001"
                  className={`${inputClasses(errors.zipCode)} pl-10`}
                />
              </div>
            </motion.div>

            {/* City Select */}
            <motion.div variants={itemVariants} className="space-y-1">
              {/* label & error */}
              <InputErrorUp isError={errors.city} message={errors.city?.message} label="city" />
              <div className="relative">
                <select
                  {...register('city')}
                  disabled={!watchedState}
                  className={inputClasses(errors.city)}
                >
                  <option value="">Select City</option>
                  {cityOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <FiChevronDown />
                </div>
              </div>
            </motion.div>

            {/* Label Select */}
            <motion.div variants={itemVariants} className="space-y-1">
              {/* label & errors */}
              <InputErrorUp
                isError={errors.label}
                message={errors.label?.message}
                label="Address Type"
              />
              <div className="relative">
                <select
                  {...register('label')}
                  disabled={!!addressId}
                  className={inputClasses(errors.label)}
                >
                  <option value="" disabled>
                    Select Address Type
                  </option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Work">Work</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <FiChevronDown />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary w-full rounded-md py-2 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Save Address'}
              </button>
            </motion.div>
          </motion.div>
        </form>
      </FormProvider>
    </>
  );
};

export default EditAddress;
