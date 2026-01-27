import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient.js';
import LoadingSpinner from '../global/LoadingSpinner.jsx';
import ProductCard from '../products/ProductCard.jsx';

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.get('/products?_sort=id&_order=desc&_limit=4');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="new" className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">New Arrivals</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Discover our latest collection of trendy fashion items
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="hover:bg-primary inline-block rounded-full bg-gray-900 px-8 py-3 font-medium text-white transition-all hover:scale-105"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
