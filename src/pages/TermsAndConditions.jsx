import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <button
            onClick={() => navigate(-1)}
            className="group hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:text-white"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Sales and Service Policy</h1>
        </div>

        <div className="p-8 text-gray-600">
          <p className="mb-8 text-lg leading-relaxed">
            This Sales and Service Policy outlines the terms of engagement for{' '}
            <strong className="text-gray-900">Patrick Cavanni Ltd</strong>. By placing an order with
            us, you agree to the following terms regarding our Ready-to-Wear (RTW) and Bespoke
            collections.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  1
                </span>
                Order Types & Production
              </h2>
              <div className="ml-11 space-y-4 rounded-lg bg-gray-50 p-6">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Ready-to-Wear (RTW)</h3>
                  <p className="text-sm leading-relaxed">
                    Clients are responsible for selecting the correct size based on our provided
                    size chart. Minor adjustments are considered "Alterations" and may incur fees.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Bespoke & Made-to-Measure</h3>
                  <p className="text-sm leading-relaxed">
                    A formal measurement session is required. If measurements are provided remotely,
                    we are not responsible for fit inaccuracies. No changes to design can be made
                    once fabric is cut and deposit is paid.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  2
                </span>
                Payment Terms
              </h2>
              <ul className="ml-11 list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong className="text-gray-900">Ready-to-Wear:</strong> 100% full payment at
                  time of purchase.
                </li>
                <li>
                  <strong className="text-gray-900">Bespoke:</strong> 70% non-refundable deposit to
                  initiate; 30% balance due upon final fitting/delivery.
                </li>
                <li>
                  <strong className="text-gray-900">Ownership:</strong> Garments remain property of
                  Patrick Cavanni Ltd until paid in full.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  3
                </span>
                Return & Exchange Policy
              </h2>
              <div className="ml-11 space-y-2 text-sm">
                <p>
                  <strong className="text-gray-900">Strict No-Refund Policy:</strong> We do not
                  offer monetary refunds for "change of mind" or cancellations.
                </p>
                <p>
                  <strong className="text-gray-900">Exchanges (RTW Only):</strong> Within 7 days in
                  original condition. Bespoke and sale items are final sale.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  4
                </span>
                Alterations & Fittings
              </h2>
              <p className="ml-11 text-sm">
                Bespoke includes two complimentary fittings. Subsequent fittings or requests after
                14 days of collection will be charged as a new service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  5
                </span>
                Shipping & Collection
              </h2>
              <div className="ml-11 space-y-2 text-sm">
                <p>
                  <strong className="text-gray-900">Timelines:</strong> Estimated dates are not
                  guaranteed. We recommend ordering 6–8 weeks in advance.
                </p>
                <p>
                  <strong className="text-gray-900">Abandoned Items:</strong> Items not collected
                  within 60 days of final notice will be forfeited.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-900">
                <span className="bg-primary/10 text-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  6
                </span>
                Quality Guarantee
              </h2>
              <p className="ml-11 text-sm">
                Free repairs for genuine construction defects within 30 days. Does not cover general
                wear/tear or improper cleaning.
              </p>
            </section>
          </div>

          <div className="border-primary/20 bg-primary/5 mt-10 rounded-lg border p-6">
            <p className="text-center text-sm font-medium text-gray-900">
              <strong>Acceptance:</strong> Placement of an order and payment of a deposit
              constitutes your agreement to these policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
