import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowLeftCircle, FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AddressCard from '../../components/global/AddressCard';
import ConfirmDialog from '../../components/global/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';

const AddressList = () => {
  const { user, updateUser } = useAuth();
  const [deleteId, setDeleteId] = useState(null);

  const handleSetDefault = async (addressId) => {
    try {
      // 1. Create a shallow copy of the addresses
      const currentAddress = [...(user.address || [])];

      // 2. Find the index of the address we want to make default
      const targetIndex = currentAddress.findIndex((addr) => addr.id === addressId);

      if (targetIndex === -1) return;

      // 3. Update the list:
      // Set target to true, others to false, then move target to index 0
      const updatedList = currentAddress.map((addr, index) => ({
        ...addr,
        isDefault: index === targetIndex,
      }));

      // Remove the target item from its current position and put it at the start
      const [defaultAddress] = updatedList.splice(targetIndex, 1);
      updatedList.unshift(defaultAddress);

      // 4. Update the user object in the database/context
      await updateUser(user.id, {
        ...user,
        address: updatedList,
      });

      toast.success('Default address updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update default address');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const updatedList = user.address.filter((addr) => addr.id !== deleteId);
      await updateUser(user.id, {
        ...user,
        address: updatedList,
      });
      toast.success('Address deleted');
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete address');
    }
  };

  return (
    <section>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />

      <header className="mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          <Link to="/profile">
            <FiArrowLeftCircle className="text-primary hover:text-primary/60 h-6 w-6 transition-colors" />
          </Link>
          <h2 className="text-xl font-bold">Shipping Addresses</h2>
        </div>
        <Link
          to={`/profile/address/create`}
          className="bg-primary flex items-center gap-1 rounded-2xl px-4 py-2 text-xs text-white transition-opacity hover:opacity-90"
        >
          <FiPlus />
          <span>Add New Address</span>
        </Link>
      </header>

      <div className="flex flex-col gap-4">
        {user.address?.map((addr) => (
          <div
            key={addr.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200"
          >
            {/* Address Details Link */}
            <div className="bg-gray-50">
              <AddressCard addr={addr}>
                <div className="flex items-center justify-end gap-6 bg-gray-50 p-3">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="bg-primary mr-auto cursor-pointer rounded-2xl px-4 py-1 text-sm text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      set as default
                    </button>
                  )}

                  <Link to={`/profile/address/edit/${addr.id}`}>
                    <FiEdit className="text-primary cursor-pointer hover:scale-110" />
                  </Link>

                  <button onClick={() => setDeleteId(addr.id)} className="hover:scale-110">
                    <FiTrash className="text-primary cursor-pointer" />
                  </button>
                </div>
              </AddressCard>
            </div>

            {/* Actions Bar */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddressList;
