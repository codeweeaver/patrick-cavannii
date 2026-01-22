import toast from 'react-hot-toast';
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AddressCard from '../../components/global/AddressCard';
import { useAuth } from '../../hooks/useAuth';

const AddressList = () => {
  const { user, updateUser } = useAuth();

  const handleSetDefault = async (addressId) => {
    try {
      // 1. Create a shallow copy of the addresses
      const currentAddresses = [...(user.addressess || [])];

      // 2. Find the index of the address we want to make default
      const targetIndex = currentAddresses.findIndex((addr) => addr.id === addressId);

      if (targetIndex === -1) return;

      // 3. Update the list:
      // Set target to true, others to false, then move target to index 0
      const updatedList = currentAddresses.map((addr, index) => ({
        ...addr,
        isDefault: index === targetIndex,
      }));

      // Remove the target item from its current position and put it at the start
      const [defaultAddress] = updatedList.splice(targetIndex, 1);
      updatedList.unshift(defaultAddress);

      // 4. Update the user object in the database/context
      await updateUser(user.id, {
        ...user,
        addressess: updatedList,
      });

      toast.success('Default address updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update default address');
    }
  };

  return (
    <section>
      <header className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">Shipping Addresses</h2>
        <Link
          to={`/profile/address/create`}
          className="bg-primary flex items-center gap-1 rounded-2xl px-4 py-2 text-xs text-white transition-opacity hover:opacity-90"
        >
          <FiPlus />
          <span>Add New Address</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {user.addressess?.map((addr) => (
          <div
            key={addr.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200"
          >
            {/* Address Details Link */}
            <Link
              to={`/profile/address/edit/${addr.id}`}
              className="bg-gray-50 transition-colors hover:bg-gray-100"
            >
              <AddressCard addr={addr} />
            </Link>

            {/* Actions Bar */}
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

              <button
                onClick={() => {
                  /* Add delete logic here later */
                }}
                className="hover:scale-110"
              >
                <FiTrash className="text-primary cursor-pointer" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddressList;
