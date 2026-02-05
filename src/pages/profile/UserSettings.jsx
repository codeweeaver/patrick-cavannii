import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormProvider } from 'react-hook-form';

import {
  FiAlertTriangle,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';

import { TextInput } from '../../components/forms/TextInput';

import AnimatedPage from '../../components/global/AnimatedPage';

import ConfirmDialog from '../../components/global/ConfirmDialog';

import Accordion from '../../components/global/Accordion';

import { useAuth } from '../../hooks/useAuth';

import { useChangeNameForm } from '../../hooks/useChangeNameForm';

import { useChangeEmailForm } from '../../hooks/useChangeEmailForm';

import { useChangePasswordForm } from '../../hooks/useChangePasswordForm';

// ============================================================================
// NAME FORM COMPONENT
// ============================================================================
const NameFormSection = ({ user }) => {
  const { methods, isEditing, handleEdit, handleCancel, onSubmit } = useChangeNameForm(user?.name);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Display Name</span>

          <button
            type="button"
            onClick={isEditing ? handleCancel : handleEdit}
            className="text-primary text-xs font-bold uppercase hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <TextInput
              name="name"
              placeholder="Full Name"
              icon={<FiUser />}
              disabled={!isEditing}
              validate={{
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                pattern: {
                  value: /^[a-zA-Z\s]{2,50}$/,
                  message: 'Name can only contain letters and spaces',
                },
              }}
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary h-12 rounded-xl px-6 font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          )}
        </form>
      </div>
    </FormProvider>
  );
};

// ============================================================================
// EMAIL FORM COMPONENT
// ============================================================================
const EmailFormSection = ({ user }) => {
  const { methods, isEditing, emailVerificationSent, handleEdit, handleCancel, onSubmit } =
    useChangeEmailForm(user?.email);

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Email Address</span>

            {emailVerificationSent && (
              <span className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                <FiRefreshCw className="animate-spin" size={10} /> PENDING
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={isEditing ? handleCancel : handleEdit}
            className="text-primary text-xs font-bold uppercase hover:underline"
          >
            {isEditing ? 'Cancel' : 'Change Email'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <TextInput
                name="email"
                type="email"
                placeholder="New Email Address"
                icon={<FiMail />}
                disabled={!isEditing}
                validate={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                }}
              />
            </div>

            {isEditing && (
              <div className="flex-1">
                <TextInput
                  name="verifyPassword"
                  type="password"
                  placeholder="Confirm with Password"
                  icon={<FiLock />}
                  validate={{
                    required: 'Password is required to verify email change',
                  }}
                />
              </div>
            )}
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary h-12 w-full rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Update'}
            </button>
          )}

          {emailVerificationSent && !isEditing && (
            <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-medium text-amber-700">
                Link sent to <strong>{getValues('email')}</strong>.
              </p>

              <button type="button" className="text-xs font-bold text-amber-800 underline">
                Resend
              </button>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  );
};

// ============================================================================
// PASSWORD FORM COMPONENT
// ============================================================================
const PasswordFormSection = () => {
  const { methods, isEditing, handleEdit, handleCancel, onSubmit } = useChangePasswordForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <div className="pb-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Account Password</span>

          <button
            type="button"
            onClick={isEditing ? handleCancel : handleEdit}
            className="text-primary text-xs font-bold uppercase hover:underline"
          >
            {isEditing ? 'Cancel' : 'Update'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextInput
              name="currentPassword"
              label="Current"
              type="password"
              disabled={!isEditing}
              validate={{
                required: 'Current password is required',
              }}
            />

            <TextInput
              name="newPassword"
              label="New"
              type="password"
              disabled={!isEditing}
              validate={{
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and numbers',
                },
              }}
            />

            <TextInput
              name="confirmPassword"
              label="Confirm"
              type="password"
              disabled={!isEditing}
              validate={{
                required: 'Please confirm your password',
                matchField: 'newPassword',
              }}
              matchField="newPassword"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary h-12 w-full rounded-xl font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Confirm Password Change'}
            </button>
          )}
        </form>
      </div>
    </FormProvider>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const UserSettings = () => {
  const navigate = useNavigate();

  const { deleteUser, user } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await deleteUser(user.id);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-4xl space-y-8 pb-20">
        <header>
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

          <p className="mt-1 text-gray-500">Manage your profile details and account security.</p>
        </header>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
          confirmText="Delete Account"
          isDangerous={true}
          isLoading={isDeleting}
        />

        {/* PROFILE SETTINGS SECTION WITH ACCORDIONS */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* NAME ACCORDION */}
          <Accordion
            title={
              <div className="flex items-center gap-2">
                <FiUser className="text-primary" /> Profile Information
              </div>
            }
            defaultOpen={true}
          >
            <NameFormSection user={user} />
          </Accordion>

          {/* EMAIL ACCORDION */}
          <Accordion
            title={
              <div className="flex items-center gap-2">
                <FiMail className="text-primary" /> Email Address
              </div>
            }
          >
            <EmailFormSection user={user} />
          </Accordion>

          {/* SECURITY ACCORDION */}
          <Accordion
            title={
              <div className="flex items-center gap-2">
                <FiShield className="text-primary" /> Security & 2FA
              </div>
            }
          >
            <div className="space-y-6 divide-y divide-gray-100">
              {/* Password Section */}
              <PasswordFormSection />

              {/* 2FA Section */}
              <div className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Two-Factor Authentication
                      </span>

                      {is2FAEnabled && (
                        <span className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Secure your account with TOTP (Authenticator App).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      is2FAEnabled ? setIs2FAEnabled(false) : navigate('/profile/settings/2fa')
                    }
                    className={`rounded-lg px-4 py-2 text-xs font-bold uppercase ${
                      is2FAEnabled ? 'bg-gray-100 text-gray-600' : 'bg-black text-white'
                    }`}
                  >
                    {is2FAEnabled ? 'Disable' : 'Set Up'}
                  </button>
                </div>
              </div>
            </div>
          </Accordion>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-red-800">
                <FiAlertTriangle /> Danger Zone
              </h3>

              <p className="text-xs text-red-600">
                Deleting your account is permanent and cannot be reversed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <FiTrash2 /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default UserSettings;
