import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { changeNameSchema } from '../schema/changeNameSchema';
import { useAuth } from './useAuth';

export const useChangeNameForm = (initialName) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser, user } = useAuth();

  const methods = useForm({
    resolver: yupResolver(changeNameSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialName || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const success = await updateUser(user.id, { name: data.name });
      if (success) {
        toast.success('Name updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update name');
      throw error;
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    methods.reset({ name: initialName || '' });
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
