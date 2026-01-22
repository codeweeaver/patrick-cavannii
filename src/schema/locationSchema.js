import * as Yup from 'yup';

export const locationSchema = Yup.object().shape({
  street: Yup.string()
    .required('Street address is required')
    .min(5, 'Please provide a valid street address'),

  city: Yup.string().required('City is required'),

  state: Yup.string().required('State is required'),

  zipCode: Yup.string()
    .required('required')
    .matches(/^[0-9a-zA-Z -]+$/, 'Invalid format'),

  country: Yup.string().required('Please select a country'),
  label: Yup.string().required('address type is required'),
});
