import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import { FiArrowLeft, FiCheck, FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';

const TwoFactorSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [twoFactorSecret] = useState('JBSWY3DPEHPK3PXP');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const inputRefs = useRef([]);

  // Handle individual digit input
  const handleDigitInput = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setVerificationError('');

    // Auto-focus next input if digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Backspace') {
      const newCode = [...verificationCode];
      newCode[index] = '';
      setVerificationCode(newCode);
    }
  };

  // Paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newCode = digits.split('');
      while (newCode.length < 6) {
        newCode.push('');
      }
      setVerificationCode(newCode);

      // Focus the next empty input or last input
      const nextEmptyIndex = newCode.findIndex((code) => !code);
      if (nextEmptyIndex >= 0) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Verify 2FA code
  const handleVerify = async () => {
    const code = verificationCode.join('');

    if (code.length !== 6) {
      setVerificationError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      // Simulate API call
      // In a real app, you'd call your backend to verify the code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, any 6-digit code is accepted
      setVerificationSuccess(true);

      setTimeout(() => {
        navigate('/profile/settings');
      }, 2000);
    } catch {
      setVerificationError('Invalid verification code. Please try again.');
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Copy secret key to clipboard
  const copySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(twoFactorSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      console.error('Failed to copy secret key');
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile/settings')}
            className="text-primary mb-6 flex items-center gap-2 hover:underline"
          >
            <FiArrowLeft size={18} />
            Back to Settings
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Setup Authenticator App</h1>
          <p className="mt-2 text-gray-600">
            Each time you log in, in addition to your password, you'll use an authenticator app to
            generate a one-time code.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-8">
          {/* Step 1: Scan QR Code */}
          <div
            className={`rounded-2xl border transition-all ${
              step === 1
                ? 'border-primary bg-white shadow-lg'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="border-primary bg-primary flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-white">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-900">Scan QR Code</h2>
              </div>

              <p className="mb-6 text-gray-700">
                Scan the QR code below or manually enter the secret key into your authenticator app.
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm">
                    <QRCodeSVG
                      value={`otpauth://totp/MyApp:${user?.email}?secret=${twoFactorSecret}&issuer=MyApp`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-900">Can't scan QR code?</p>
                    <p className="text-sm text-gray-600">Enter this secret instead:</p>
                  </div>

                  <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                    <code className="block font-mono text-sm font-semibold break-all text-gray-900">
                      {twoFactorSecret}
                    </code>
                  </div>

                  <button
                    onClick={copySecretKey}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    <FiCopy size={18} />
                    {copiedSecret ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="bg-primary mt-8 w-full rounded-lg px-6 py-3 font-bold text-white transition-all hover:opacity-90"
              >
                Next: Verify Code
              </button>
            </div>
          </div>

          {/* Step 2: Verify Code */}
          <div
            className={`rounded-2xl border transition-all ${
              step === 2
                ? 'border-primary bg-white shadow-lg'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold ${
                    verificationSuccess
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-gray-100 text-gray-600'
                  }`}
                >
                  {verificationSuccess ? <FiCheck size={18} /> : '2'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">Get Verification Code</h2>
              </div>

              <p className="mb-6 text-gray-700">
                Enter the 6-digit code you see in your authenticator app.
              </p>

              {/* Code Input Boxes */}
              <div className="mb-6 flex justify-center gap-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleDigitInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={step !== 2 || isVerifying || verificationSuccess}
                    className={`h-16 w-14 rounded-xl border-2 text-center text-2xl font-bold transition-colors ${
                      verificationError
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'focus:border-primary focus:ring-primary/10 border-gray-300 focus:ring-2'
                    } ${
                      verificationSuccess
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'bg-white text-gray-900'
                    }`}
                    autoFocus={index === 0 && step === 2}
                  />
                ))}
              </div>

              {/* Error Message */}
              {verificationError && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{verificationError}</p>
                </div>
              )}

              {/* Success Message */}
              {verificationSuccess && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    ✓ Two-Factor Authentication successfully enabled!
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={isVerifying || verificationSuccess}
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || verificationSuccess}
                  className="bg-primary flex-1 rounded-lg px-6 py-3 font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : verificationSuccess ? 'Confirmed!' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default TwoFactorSetup;
