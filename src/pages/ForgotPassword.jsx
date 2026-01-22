import { FaGoogle } from 'react-icons/fa';
import { FiArrowLeft, FiFacebook, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="relative p-8">
      <button
        className="hover:text-primary absolute -top-5 left-5 z-50 flex h-10 w-10 transform items-center justify-center rounded-full shadow-md transition-all hover:scale-105"
        tooltip="go back to login"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft />
      </button>
      <div className="my-8 text-center">
        <p className="text-xl text-gray-600">
          Enter the email address or mobile number associated with your account.
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              className="focus:ring-primary focus:border-primary block w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 shadow-sm focus:ring-2 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-primary/90 hover:bg-primary focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-6 py-3 text-sm font-medium text-white uppercase shadow-sm transition-all hover:scale-101 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Send
          </button>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* signup with social media */}
        <div className="mt-6 flex items-center justify-center gap-5">
          {/* Facebook */}
          <Link
            to="/auth/facebook"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b5998] text-white transition-colors hover:bg-[#344e86]"
            aria-label="Login with Facebook"
          >
            <FiFacebook className="h-5 w-5" />
          </Link>

          {/* Twitter */}
          <Link
            to="/auth/twitter"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DA1F2] text-white transition-colors hover:bg-[#1a8cd8]"
            aria-label="Login with Twitter"
          >
            <FiTwitter className="h-5 w-5" />
          </Link>

          {/* Google */}
          <Link
            to="/auth/google"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DB4437] text-white transition-colors hover:bg-[#c53929]"
            aria-label="Login with Google"
          >
            <FaGoogle className="h-5 w-5" />
          </Link>

          {/* LinkedIn */}
          <Link
            to="/auth/linkedin"
            className="flex aspect-square h-10 w-10 items-center justify-center rounded-lg bg-[#0077B5] text-white transition-colors hover:bg-[#00669b]"
            aria-label="Login with LinkedIn"
          >
            <FiLinkedin className="h-5 w-5" />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
