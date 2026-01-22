import { HashLoader } from 'react-spinners';
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/50">
      <HashLoader color="#c99947" cssOverride={{}} size={40} />
    </div>
  );
};

export default LoadingSpinner;
