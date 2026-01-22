import { yupResolver } from '@hookform/resolvers/yup';
import { City, State } from 'country-state-city';
import { motion } from 'framer-motion';
import parsePhoneNumber from 'libphonenumber-js';
import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiFlag, FiMap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list';
import { Input } from '../../components/global/Input';
import { locationSchema } from '../../schema/locationSchema';
import { apiClient } from '../../utils/apiClient';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Address = () => {
  const navigate = useNavigate();

  const savedData = useMemo(() => JSON.parse(sessionStorage.getItem('addressData') || '{}'), []);
  const personalData = useMemo(
    () => JSON.parse(sessionStorage.getItem('personalData') || '{}'),
    [],
  );

  useEffect(() => {
    if (Object.keys(personalData).length === 0) {
      navigate('/register', { replace: true });
      return;
    }
    const securityData = JSON.parse(sessionStorage.getItem('securityData') || '{}');
    if (Object.keys(securityData).length === 0) {
      navigate('/register/security', { replace: true });
    }
  }, [navigate, personalData]);

  // Auto-detect country from phone number if no address country is saved
  let defaultCountry = savedData.country;
  let isCountryLocked = false;
  if (personalData.phone) {
    try {
      const phoneNumber = parsePhoneNumber(personalData.phone);
      if (phoneNumber && phoneNumber.country) {
        defaultCountry = phoneNumber.country;
        isCountryLocked = true;
      }
    } catch (error) {
      console.error('Could not parse phone number from personalData:', personalData.phone, error);
      // Fallback to unlocked country select, which is the default behavior.
    }
  }

  const methods = useForm({
    defaultValues: {
      street: savedData.street || '',
      city: savedData.city || '',
      zipCode: savedData.zipCode || '',
      country: defaultCountry || 'NG',
      state: savedData.state || '',
      label: savedData.label || 'Home',
    },
    resolver: yupResolver(locationSchema),
  });

  const { isSubmitting } = methods.formState;

  const { control, setValue } = methods;

  // Watch Country
  const watchedCountry = useWatch({ control, name: 'country' });

  // Watch State
  const watchedState = useWatch({ control, name: 'state' });

  // Refs to track previous values for cascading resets
  const previousCountry = useRef(watchedCountry);
  const previousState = useRef(watchedState);

  // Generate State Options
  const stateOptions = useMemo(() => {
    if (!watchedCountry) return [];
    return State.getStatesOfCountry(watchedCountry).map((state) => ({
      value: state.isoCode, // e.g., "LA" for Lagos
      label: state.name, // e.g., "Lagos State"
    }));
  }, [watchedCountry]);

  // Generate City Options based on selected State
  const cityOptions = useMemo(() => {
    if (!watchedCountry || !watchedState) return [];
    return City.getCitiesOfState(watchedCountry, watchedState).map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [watchedCountry, watchedState]);

  // Reset downstream fields when parents change
  useEffect(() => {
    if (watchedCountry !== previousCountry.current) {
      setValue('state', '');
      setValue('city', '');
      setValue('zipCode', '');
      previousCountry.current = watchedCountry;
    }
  }, [watchedCountry, setValue]);

  useEffect(() => {
    if (watchedState !== previousState.current) {
      setValue('city', '');
      previousState.current = watchedState;
    }
  }, [watchedState, setValue]);

  const handleBack = () => {
    const currentValues = methods.getValues();
    sessionStorage.setItem('addressData', JSON.stringify(currentValues));
    navigate('/register/security');
  };

  const onSubmit = async (data) => {
    try {
      const securityData = JSON.parse(sessionStorage.getItem('securityData') || '{}');

      // Convert codes to full text for Country and State
      const countryLabel = countryList().getLabel(data.country);
      const stateObj = State.getStateByCodeAndCountry(data.state, data.country);

      const finalData = {
        ...personalData,
        ...securityData,
        addressess: [
          {
            id: crypto.randomUUID(),
            label: 'Home',
            isDefault: true,
            country: countryLabel || data.country,
            state: stateObj ? stateObj.name : data.state,
            city: data.city,
            zipCode: data.zipCode,
            street: data.street,
          },
        ],
        role: 'user',
        cart: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

      await apiClient.post('/users', finalData);

      sessionStorage.removeItem('personalData');
      sessionStorage.removeItem('securityData');
      sessionStorage.removeItem('addressData');

      toast.success('Account created successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          key="step3"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <Input
              select={true}
              name="country"
              label="Country"
              isCountry={true}
              options={countryList().getData()}
              id="country"
              placeholder="Select Country"
              disabled={isCountryLocked}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              select
              name="state"
              label="State"
              placeholder="Select State"
              options={stateOptions}
              disabled={!watchedCountry}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              select
              name="city"
              label="City"
              placeholder={watchedCountry ? 'Select City' : 'Select a country first'}
              options={cityOptions}
              disabled={!watchedCountry} // Disable if no country is picked
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="zipCode"
              label="Zip Code"
              type="text"
              id="zipCode"
              placeholder="100001"
              icon={<FiFlag />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="street"
              label="Street"
              type="text"
              id="street"
              placeholder="123 Main St, Apt 4B"
              icon={<FiMap />}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="focus:ring-primary flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'Creating..' : 'Register'}
            </button>
          </motion.div>
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default Address;
