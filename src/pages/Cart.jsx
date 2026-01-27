import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  // Added clearCart to the destructuring
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

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
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* --- LEFT SIDE: CART ITEMS --- */}
          <div className="w-full space-y-4 lg:flex-1">
            <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold text-gray-900">Shopping Cart</h2>

              {/* Added Button Group here */}
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </span>

                <button
                  onClick={clearCart}
                  className="text-xs font-bold tracking-tight text-gray-400 uppercase transition-colors hover:text-red-500"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              {cartItems.map((item) => {
                const discount = item.originalPrice
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : 0;

                const variantData = item.inventory?.variants?.find((v) => v.sku === item.sku);
                const totalStock = variantData
                  ? (variantData.stock ?? variantData.quantity)
                  : (item.inventory?.quantity ?? 20);

                const remainingToBuy = totalStock - item.quantity;

                const displaySize = item.size || item.selectedSize || variantData?.size;
                const displayColor = item.color || item.selectedColor || variantData?.color;
                const displayColorCode = item.colorCode || variantData?.colorCode;

                return (
                  <div
                    key={item.sku}
                    className="group relative flex flex-col border-b border-gray-50 p-5 transition-colors last:border-0 hover:bg-gray-50/50 md:flex-row md:items-center"
                  >
                    {/* Product Image */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        alt={item.name}
                        className="h-full w-full object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 flex flex-1 flex-col md:mt-0 md:pl-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-primary text-[10px] font-bold tracking-widest uppercase">
                            {item.brand}
                          </p>
                          <h3 className="mt-1 line-clamp-1 text-base font-bold text-gray-900">
                            {item.name}
                          </h3>
                        </div>
                        <div className="hidden text-right md:block">
                          <p className="text-lg font-black text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                          {discount > 0 && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Variants & DYNAMIC STOCK INDICATOR */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {displaySize && (
                          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700 shadow-sm">
                            <span className="font-medium text-gray-400">SIZE:</span> {displaySize}
                          </div>
                        )}

                        {displayColor && (
                          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700 shadow-sm">
                            <span className="font-medium text-gray-400">COLOR:</span>
                            <span
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: displayColorCode || displayColor.toLowerCase(),
                              }}
                            />
                            {displayColor.toUpperCase()}
                          </div>
                        )}

                        {remainingToBuy <= 5 ? (
                          <span className="animate-pulse rounded bg-red-50 px-2 py-1 text-[10px] font-bold tracking-tighter text-red-500 uppercase">
                            {remainingToBuy === 0
                              ? 'Max Stock Reached'
                              : `Only ${remainingToBuy} more left`}
                          </span>
                        ) : (
                          <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-bold tracking-tighter text-green-500 uppercase">
                            In Stock ({totalStock} available)
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              disabled={item.quantity >= totalStock}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.sku)}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 transition-colors hover:text-red-500"
                          >
                            <FiTrash2 size={16} /> <span className="hidden sm:inline">REMOVE</span>
                          </button>
                        </div>

                        <div className="text-right md:hidden">
                          <p className="text-lg font-black text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- RIGHT SIDE: SUMMARY --- */}
          <aside className="w-full lg:sticky lg:top-24 lg:w-96">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-6 text-lg font-bold text-gray-900">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="my-4 border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-primary text-2xl font-black">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-primary w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
