import {
  FiChevronRight,
  FiCreditCard,
  FiMessageSquare,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const HelpLayout = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const helpLinks = [
    {
      id: 1,
      icon: <FiMessageSquare className="h-5 w-5" />,
      title: 'Help Center',
      path: '/help-center',
      description: 'Get help with your account or order',
    },
    {
      id: 2,
      icon: <FiShoppingBag className="h-5 w-5" />,
      title: 'Place an Order',
      path: '/help-center/order',
      description: 'Learn how to place an order',
    },
    {
      id: 3,
      icon: <FiCreditCard className="h-5 w-5" />,
      title: 'Payment Options',
      path: '/help-center/payment',
      description: 'Learn about payment methods',
    },
    {
      id: 4,
      icon: <FiTruck className="h-5 w-5" />,
      title: 'Track an Order',
      path: '/help-center/shipping',
      description: 'Track your order status',
    },
    {
      id: 5,
      icon: <FiXCircle className="h-5 w-5" />,
      title: 'Return & Refund',
      path: '/help-center/return',
      description: 'Start a return or exchange',
    },
    {
      id: 6,
      icon: <FiMessageSquare className="h-5 w-5" />,
      title: 'Contact Us',
      path: '/help-center/contact',
      description: 'Reach out to our support team',
    },
  ];

  return (
    <div className="font-primary min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold">How can we help?</h1>
          <p className="mt-4 text-lg text-gray-200">
            Find answers to common questions or contact our support team.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full rounded-lg px-6 py-3 text-gray-50 outline-2 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-accent hover:bg-accent/70 absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md px-6 py-2 text-white transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full shrink-0 md:w-80">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-lg font-semibold text-gray-900">Help Topics</h2>
              </div>
              <nav>
                <ul className="divide-y divide-gray-200">
                  {helpLinks.map((link) => (
                    <li key={link.id}>
                      <NavLink
                        to={link.path}
                        className={`flex items-center justify-between p-4 transition-colors hover:bg-gray-50 ${
                          isActive(link.path) ? 'bg-primary/5 border-accent border-l-4' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`rounded-full p-2 ${
                              isActive(link.path)
                                ? 'bg-accent/10 text-accent'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {link.icon}
                          </span>
                          <div>
                            <h3
                              className={`text-sm font-medium ${
                                isActive(link.path) ? 'text-primary' : 'text-gray-900'
                              }`}
                            >
                              {link.title}
                            </h3>
                            <p className="text-xs text-gray-600">{link.description}</p>
                          </div>
                        </div>
                        <FiChevronRight
                          className={`h-5 w-5 ${
                            isActive(link.path) ? 'text-accent' : 'text-gray-400'
                          }`}
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HelpLayout;
