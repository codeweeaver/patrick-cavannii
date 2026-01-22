import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import AnimatedPage from '../../components/global/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';

const UserSettings = () => {
  const { deleteUser, user } = useAuth();
  const { isLoading } = useLoading();

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
          <p className="mt-1 text-gray-500">Manage your profile details and account security.</p>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-red-800">
            <FiAlertTriangle /> Danger Zone
          </h3>
          <p className="mb-6 text-sm text-red-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently remove your account and all data.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const deleteAcount = window.confirm(
                  'Are you sure you want to delete your account? This action cannot be undone.',
                );
                if (deleteAcount) {
                  deleteUser(user.id);
                }
              }}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <FiTrash2 />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default UserSettings;
