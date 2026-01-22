import { FiInfo, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // --- EMPTY STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-white p-8 shadow-sm">
          <FiShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">Your cart is empty!</h3>
        <p className="mb-8 max-w-xs text-gray-500">
          Explore our latest bespoke collections and find something special.
        </p>
        <Link
          to="/products"
          className="bg-primary rounded-md px-10 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* --- LEFT SIDE: CART ITEMS --- */}
          <div className="w-full space-y-3 lg:flex-1">
            <div className="rounded-sm bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800">Cart ({cartCount})</h2>
            </div>

            {cartItems.map((item) => {
              const discount = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;

              const maxQuantity = item.stock || 20;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col border-b border-gray-100 bg-white p-4 shadow-sm last:border-0 md:flex-row md:items-center"
                >
                  {/* Image & Main Info Container */}
                  <div className="flex flex-1 gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="group-hover:text-primary line-clamp-2 text-sm text-gray-800 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-gray-400 uppercase">
                        Brand: {item.brand}
                      </p>
                      {item.inventory.quantity > 0 && (
                        <p
                          className={`text-xs font-medium whitespace-nowrap ${item.inventory.quantity < 20 ? 'text-red-500' : 'text-green-500'}`}
                        >
                          pieces left: {item.inventory.quantity}
                        </p>
                      )}

                      {/* Mobile Price View */}
                      <div className="mt-2 block md:hidden">
                        <p className="text-lg font-bold">{formatPrice(item.price)}</p>
                        {discount > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                            <span className="bg-primary/10 text-primary rounded px-1 text-[10px] font-bold">
                              -{discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price & Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between md:mt-0 md:w-1/3 md:flex-col md:items-end">
                    <div className="hidden text-right md:block">
                      <p className="text-xl font-bold">{formatPrice(item.price)}</p>
                      {discount > 0 && (
                        <p className="text-xs text-gray-400">
                          <span className="line-through">{formatPrice(item.originalPrice)}</span>
                          <span className="text-primary ml-2">-{discount}%</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-6 md:mt-6">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 /> REMOVE
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="bg-primary flex h-7 w-7 items-center justify-center rounded text-white disabled:bg-gray-200"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxQuantity}
                          className="bg-primary flex h-7 w-7 items-center justify-center rounded text-white disabled:cursor-not-allowed disabled:bg-gray-200"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT SIDE: SUMMARY (Sticky) --- */}
          <aside className="w-full lg:sticky lg:top-24 lg:w-80">
            <div className="rounded-sm bg-white p-4 shadow-sm">
              <h3 className="mb-4 border-b pb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Cart Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 italic">
                  <span className="flex items-center gap-1">
                    <FiInfo /> Delivery fees not included
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">Total</span>
                  <span className="text-xl font-black text-gray-900">{formatPrice(cartTotal)}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-primary shadow-primary/20 hover:bg-primary/90 w-full rounded py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95"
                >
                  CHECKOUT ({formatPrice(cartTotal)})
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-sm border-l-4 border-blue-500 bg-white p-4 shadow-sm">
              <p className="text-[10px] leading-relaxed text-gray-500">
                Returns are easy. Free return within 7 days for all eligible items.{' '}
                <Link to="/returns" className="text-blue-500 underline">
                  Details
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
