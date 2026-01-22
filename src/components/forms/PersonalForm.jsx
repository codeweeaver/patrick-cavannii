import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { personalSchema } from '../../schema/personalSchema';
import { Input } from '../global/Input';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const PersonalForm = ({ closeModal }) => {
  const { user, updateUser } = useAuth();

  const methods = useForm({
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    },
    resolver: yupResolver(personalSchema),
  });

  const onSubmit = async (data) => {
    const updatedUser = { ...user, ...data };
    const success = await updateUser(user.id, updatedUser);
    if (success) {
      closeModal();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div key="step1" exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              name="name"
              label="Full Name"
              type="name"
              id="name"
              placeholder="enter your full name"
              icon={<FiUser />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              name="email"
              label="Email"
              type="email"
              id="email"
              placeholder="your.email@example.com"
              icon={<FiMail />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              phone={true}
              name="phone"
              label="Phone Number"
              placeholder="+123456789"
              id="phone"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              Update User
            </button>
          </motion.div>
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default PersonalForm;
