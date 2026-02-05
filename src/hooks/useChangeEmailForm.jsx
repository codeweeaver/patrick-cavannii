import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { changeEmailSchema } from '../schema/changeEmailSchema';
import { useAuth } from './useAuth';

export const useChangeEmailForm = (initialEmail) => {
  const [isEditing, setIsEditing] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const { updateUser, user, verifyCurrentPassword } = useAuth();

  const methods = useForm({
    resolver: yupResolver(changeEmailSchema),
    mode: 'onChange',
    defaultValues: {
      email: initialEmail || '',
      verifyPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Verify password first
      const isPasswordCorrect = await verifyCurrentPassword(data.verifyPassword);
      if (!isPasswordCorrect) {
        methods.setError('verifyPassword', { message: 'Incorrect password.' });
        toast.error('Incorrect password');
        return;
      }

      // Update email
      const success = await updateUser(user.id, { email: data.email });
      if (success) {
        toast.success('Email updated successfully!');
        setEmailVerificationSent(true);
        setIsEditing(false);
        methods.resetField('verifyPassword');

        // Auto-clear the pending status after 3 seconds
        setTimeout(() => {
          setEmailVerificationSent(false);
        }, 3000);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update email');
      throw error;
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmailVerificationSent(false);
    methods.reset({ email: initialEmail || '', verifyPassword: '' });
  };

  return {
    methods,
    isEditing,
    setIsEditing,
    emailVerificationSent,
    setEmailVerificationSent,
    handleEdit,
    handleCancel,
    onSubmit,
  };
};
