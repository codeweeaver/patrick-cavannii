import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { changePasswordSchema } from '../schema/changePasswordSchema';
import { useAuth } from './useAuth';

export const useChangePasswordForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { changePassword } = useAuth();

  const methods = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const success = await changePassword(data.currentPassword, data.newPassword);
      if (success) {
        toast.success('Password changed successfully!');
        setIsEditing(false);
        methods.reset();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    methods.reset();
  };

  return {
    methods,
    isEditing,
    setIsEditing,
    handleEdit,
    handleCancel,
    onSubmit,
  };
};
