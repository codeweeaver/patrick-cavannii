import {
  FiGlobe,
  FiMap,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSmartphone,
  FiUser,
} from 'react-icons/fi';

const AddressCard = ({ addr, children }) => {
  return (
    <div className="group hover:border-primary/20 border-primary relative flex flex-col gap-4 rounded-md border-dotted bg-gray-50/50 p-5 transition-all">
      {/* Header: Badge & Status */}
      <div className="flex items-center justify-between">
        <div className="text-primary flex items-center gap-2">
          <FiMapPin className="h-4 w-4" />
          <span className="text-[10px] font-black tracking-widest uppercase">Shipping Address</span>
        </div>
        {addr.isDefault && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
            DEFAULT
          </span>
        )}
      </div>

      {/* Recipient & Address Info */}
      <div className="ml-5 space-y-1">
        <div className="flex items-center gap-2">
          <FiUser className="h-3.5 w-3.5 text-gray-400" />
          <h4 className="font-bold text-gray-900">{addr.fullName}</h4>
        </div>

        <div className="space-y-1 text-sm leading-relaxed text-gray-600">
          {/* Street Icon Added Here */}
          <div className="flex items-center gap-2 text-gray-800">
            <FiNavigation className="h-3 w-3 text-gray-400" />
            <p className="font-medium">{addr.street}</p>
          </div>

          {addr.landmark && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic">
              <FiMapPin className="h-3 w-3 text-gray-300" />
              <span>Landmark: {addr.landmark}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FiMap className="h-3 w-3 text-gray-300" />
            <span>
              {addr.city}, {addr.state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold tracking-tight text-gray-400 uppercase">
            <FiGlobe className="h-3 w-3 text-gray-300" />
            <span>{addr.country}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200/50" />

      {/* Contact Info */}
      <div className="ml-5 flex flex-wrap gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <FiSmartphone className="text-gray-400" />
          <span className="font-semibold">{addr.phone}</span>
        </div>

        {addr.altPhone && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiPhone className="text-gray-400" />
            <span>{addr.altPhone}</span>
            <span className="text-[9px] font-bold text-gray-300 uppercase">Alt</span>
          </div>
        )}

        <div className="ml-auto">{children}</div>
      </div>
    </div>
  );
};

export default AddressCard;
