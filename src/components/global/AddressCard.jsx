const AddressCard = ({ addr }) => {
  return (
    <div key={addr.id} className="flex items-start gap-3 rounded-lg bg-gray-50 p-5 text-gray-600">
      <div>
        <p className="font-bold text-gray-900">
          {addr.label}
          {addr.isDefault && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">
              PRIMARY
            </span>
          )}
        </p>
        <div className="mt-2 text-sm text-gray-700 not-italic">
          <span className="mr-1">{addr.street},</span>
          <span className="mr-1">{addr.city},</span>
          <span className="mr-1">{addr.state},</span>
          <span className="mr-1">{addr.zipCode},</span>
          <span className="mr-1">{addr.country}</span>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
