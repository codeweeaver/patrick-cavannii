import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-primary/80 text-4xl font-semibold">404</p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-white shadow focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Go back home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
