import { isValidPhoneNumber } from 'libphonenumber-js';
import * as Yup from 'yup';

export const personalSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .test('is-full-name', 'Please enter both your first and last name', (value) => {
      if (!value) return false;
      // Trims whitespace and checks if there are at least two words
      const words = value.trim().split(/\s+/);
      return words.length === 2;
    }),

  email: Yup.string().email('Invalid email address').required('Email is required'),

  phone: Yup.string()
    .required('Phone number is required')
    .test('is-valid-phone', 'Invalid phone number', (value) => {
      return value ? isValidPhoneNumber(value) : false;
    }),
});
