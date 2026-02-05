import * as Yup from 'yup';

export const changeNameSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]{2,50}$/, 'Name can only contain letters and spaces'),
});
