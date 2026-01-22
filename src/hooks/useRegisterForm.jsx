import { useContext } from 'react';
import FormContext from '../context/FormContext';

const useRegisterForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useRegisterForm must be used within a FormProvider');
  }
};

export default useRegisterForm;
