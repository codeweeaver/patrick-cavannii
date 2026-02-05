import { yupResolver } from '@hookform/resolvers/yup';
import { City, State } from 'country-state-city';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiArrowLeftCircle, FiInfo, FiMapPin, FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router'; // Added useParams
import { Link } from 'react-router-dom';
import countryList from 'react-select-country-list';

import { CheckboxInput } from '../../components/forms/CheckboxInput';
import { PhoneInput } from '../../components/forms/PhoneInput';
import { SelectInput } from '../../components/forms/SelectInput';
import { TextInput } from '../../components/forms/TextInput';
import { useAuth } from '../../hooks/useAuth';
import { locationSchema } from '../../schema/locationSchema';

const AddressForm = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const isEditMode = Boolean(id);

  const methods = useForm({
    defaultValues: {
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ')[1] || '',
      phone: '',
      altPhone: '',
      deliveryAddress: '',
      landmark: '',
      country: '',
      region: '',
      city: '',
      isDefault: false,
    },
    resolver: yupResolver(locationSchema),
  });

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // 1. HYDRATE FORM FOR EDIT MODE
  useEffect(() => {
    if (isEditMode && user?.address) {
      const addressToEdit = user.address.find((addr) => addr.id === id);

      if (addressToEdit) {
        // Find ISO codes for Country and State to make dropdowns work
        const countryData = countryList()
          .getData()
          .find((c) => c.label === addressToEdit.country);
        const countryCode = countryData?.value || '';

        // Find State Code
        const states = State.getStatesOfCountry(countryCode);
        const stateData = states.find((s) => s.name === addressToEdit.state);

        reset({
          firstName: addressToEdit.fullName.split(' ')[0],
          lastName: addressToEdit.fullName.split(' ')[1] || '',
          phone: addressToEdit.phone,
          altPhone: addressToEdit.altPhone,
          deliveryAddress: addressToEdit.street,
          landmark: addressToEdit.landmark,
          country: countryCode,
          region: stateData?.isoCode || '',
          city: addressToEdit.city,
          isDefault: addressToEdit.isDefault,
        });
      } else {
        toast.error('Address not found');
        navigate('/profile/address');
      }
    }
  }, [isEditMode, id, user.address, reset, navigate]);

  const watchedCountry = useWatch({ control, name: 'country' });
  const watchedRegion = useWatch({ control, name: 'region' });

  // 2. DROP DOWN LOGIC
  const regionOptions = useMemo(() => {
    if (!watchedCountry) return [];
    return State.getStatesOfCountry(watchedCountry).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [watchedCountry]);

  const cityOptions = useMemo(() => {
    if (!watchedCountry || !watchedRegion) return [];
    return City.getCitiesOfState(watchedCountry, watchedRegion).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [watchedCountry, watchedRegion]);

  // Reset dependent fields on change
  useEffect(() => {
    // Only reset if the field is actually different (to prevent loops during hydration)
    if (watchedCountry) {
      // setValue('region', ''); // Care: this can break hydration if not careful
    }
  }, [watchedCountry]);

  // 3. SUBMIT LOGIC (Handles Create & Update)
  const onSubmit = async (data) => {
    try {
      const countryLabel = countryList().getLabel(data.country);
      const stateObj = State.getStateByCodeAndCountry(data.region, data.country);
      const currentAddresses = user.address || [];

      // Check limit only when creating
      if (!isEditMode && currentAddresses.length >= 3) {
        toast.error('You can only add up to three addresses.');
        return;
      }

      const shouldBeDefault = currentAddresses.length === 0 ? true : data.isDefault;

      // Reset other defaults if this one is set to true
      let updatedAddresses = shouldBeDefault
        ? currentAddresses.map((addr) => ({ ...addr, isDefault: false }))
        : currentAddresses;

      const addressPayload = {
        id: isEditMode ? id : crypto.randomUUID(),
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        altPhone: data.altPhone,
        street: data.deliveryAddress,
        landmark: data.landmark,
        country: countryLabel || data.country,
        state: stateObj ? stateObj.name : data.region,
        city: data.city,
        isDefault: shouldBeDefault,
      };

      if (isEditMode) {
        updatedAddresses = updatedAddresses.map((addr) => (addr.id === id ? addressPayload : addr));
      } else {
        updatedAddresses.push(addressPayload);
      }

      await updateUser(user.id, { ...user, address: updatedAddresses });
      toast.success(isEditMode ? 'Address updated!' : 'Address created!');
      navigate('/profile/address');
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-8">
      <header className="mb-10 flex items-center justify-between border-b border-gray-600 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/profile/address">
            <FiArrowLeftCircle className="text-primary hover:text-primary/60 h-6 w-6 transition-colors" />
          </Link>
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            {isEditMode ? 'Edit Address' : 'Add New Address'}
          </h2>
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextInput
              name="firstName"
              label="First Name"
              icon={<FiUser />}
              placeholder="e.g. Suleman"
                errorClass="absolute -bottom-5 right-0"
            />
            <TextInput
              name="lastName"
              label="Last Name"
              icon={<FiUser />}
              placeholder="e.g. Adamu"
              errorClass="absolute -bottom-5 right-0"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PhoneInput name="phone" label="Phone Number" errorClass="absolute -bottom-5 right-0" />
            <PhoneInput
              name="altPhone"
              label="Additional Phone Number"
              placeholder="Optional"
              errorClass="absolute -bottom-5 right-0"
            />
          </div>

          <div className="relative space-y-6">
            <TextInput
              name="deliveryAddress"
              label="Delivery Address"
              icon={<FiMapPin />}
              placeholder="House No, Street Name, Area"
              errorClass="absolute -bottom-5 right-0"
            />
            <TextInput
              name="landmark"
              label="Additional Information"
              icon={<FiInfo />}
              placeholder="Landmark (Optional)"
              errorClass="absolute -bottom-5 right-0"
            />
          </div>

          <div className="relative z-30 grid grid-cols-1 gap-6 md:grid-cols-3">
            <SelectInput
              name="country"
              label="Country"
              isCountry
              options={countryList().getData()}
              placeholder="Select Country"
              errorClass="absolute -bottom-5 right-0"
            />
            <SelectInput
              name="region"
              label="Region"
              options={regionOptions}
              disabled={!watchedCountry}
              placeholder="Select Region"
              errorClass="absolute -bottom-5 right-0"
            />
            <SelectInput
              name="city"
              label="City"
              options={cityOptions}
              disabled={!watchedRegion}
              placeholder="Select City"
              errorClass="absolute -bottom-5 right-0"
            />
          </div>

          <div className="pt-2">
            <CheckboxInput name="isDefault" label="Set as Default Address" />
          </div>

          <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black py-4 text-sm font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : isEditMode ? 'Update Address' : 'Save Address'}
            </button>
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddressForm;
