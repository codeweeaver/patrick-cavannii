import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../hooks/useCart';

const checkoutSchema = yup.object().shape({
  // Contact
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),

  // Shipping
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  postalCode: yup.string().required('Postal code is required'),

  // Payment
  cardName: yup.string().required('Name on card is required'),
  cardNumber: yup.string().required('Card number is required'),
  cardExpiry: yup.string().required('Expiry date is required'),
  cardCVC: yup.string().required('CVC is required'),
});

const CheckOut = () => {
  const { cartItems, cartTotal, cartCount } = useCart();
  const { formatPrice } = useCurrency();

  const methods = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: 'Nigeria',
      postalCode: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Checkout data:', data);
    // Handle checkout logic here
  };

  const shippingCost = 5000; // Example shipping cost
  const total = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h3 className="mb-2 text-xl font-bold text-gray-900">Your cart is empty.</h3>
        <p className="mb-8 max-w-xs text-gray-500">
          You can't proceed to checkout with an empty cart.
        </p>
        <Link
          to="/products"
          className="bg-primary rounded-md px-10 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          GO SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse items-start gap-8 lg:flex-row">
            {/* --- LEFT SIDE: FORM --- */}
            <div className="w-full space-y-8 lg:flex-1">
              {/* Contact, Shipping, and Payment forms will go here */}
            </div>

            {/* --- RIGHT SIDE: SUMMARY (Sticky) --- */}
            <aside className="w-full lg:sticky lg:top-24 lg:w-96">
              <div className="rounded-sm bg-white p-6 shadow-sm">
                <h3 className="mb-4 border-b pb-3 text-lg font-bold tracking-wider text-gray-800 uppercase">
                  Order Summary ({cartCount})
                </h3>

                {/* Item list, totals, and checkout button will go here */}
              </div>
            </aside>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CheckOut;
