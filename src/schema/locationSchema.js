import * as Yup from 'yup';

export const locationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').min(2, 'Name is too short'),

  lastName: Yup.string().required('Last name is required').min(2, 'Name is too short'),

  phone: Yup.string()
    .required('Phone number is required')
    .test('is-valid', 'Invalid phone number', (value) => {
      return value && value.length >= 7;
    }),

  // Updated altPhone logic
  altPhone: Yup.string()
    .nullable()
    .test('not-same-as-phone', 'add a different phone number', function (value) {
      const { phone } = this.parent;
      // If altPhone is empty, it's valid (since it's optional)
      if (!value) return true;
      // Compare values
      return value !== phone;
    }),

  country: Yup.string().required('Country is required'),

  region: Yup.string().required('Region is required'),

  city: Yup.string().required('City is required'),

  deliveryAddress: Yup.string()
    .required('Delivery address is required')
    .min(5, 'Please provide a more detailed address'),

  landmark: Yup.string().nullable(),

  isDefault: Yup.boolean(),
});
