import * as Yup from 'yup';

export const changeEmailSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Please enter a valid email address'),
  verifyPassword: Yup.string().required('Password is required to verify email change'),
});
