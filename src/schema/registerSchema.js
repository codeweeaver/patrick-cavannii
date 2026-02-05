import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  fullName: Yup.string()
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

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain one lowercase letter')
    .matches(/[A-Z]/, 'Must contain one uppercase letter')
    .matches(/[0-9]/, 'Must contain one number'),

  // This is where your snippet lives
  comfirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});
