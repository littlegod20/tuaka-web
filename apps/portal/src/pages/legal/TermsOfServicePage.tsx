export function TermsOfServicePage() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gray-900">
              Tua<span className="text-amber-400">Ka</span>
            </a>
            <a href="/login" className="text-sm text-brand-500 hover:underline">
              Sign in
            </a>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>
  
          <div className="bg-white rounded-xl border border-gray-100 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of terms</h2>
              <p>
                By creating an account on TuaKa (tuaka.org), you agree to these Terms of Service.
                If you do not agree, please do not use the platform. These terms apply to all users
                including workspace owners, administrators, and members.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of service</h2>
              <p>
                TuaKa is a cloud-based invoicing and payment platform that allows businesses to
                create invoices, manage clients, collect payments via Mobile Money, and manage
                their team. We offer a free tier and paid subscription plans.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account registration</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must provide accurate and complete information when registering.</li>
                <li>You are responsible for maintaining the security of your account and password.</li>
                <li>You must be at least 18 years old to create an account.</li>
                <li>One person or legal entity may not maintain more than one free account.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Subscription and billing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>New accounts receive a 14-day free trial of the Starter plan.</li>
                <li>After the trial, accounts revert to the Free plan unless upgraded.</li>
                <li>Paid subscriptions are billed monthly in Ghana Cedis (GHS).</li>
                <li>Payments are processed by Paystack and are subject to their terms.</li>
                <li>Subscriptions automatically renew unless cancelled before the renewal date.</li>
                <li>We do not offer refunds for partial months.</li>
                <li>We reserve the right to change pricing with 30 days notice.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Acceptable use</h2>
              <p className="mb-3">You agree not to use TuaKa to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create or send fraudulent invoices</li>
                <li>Impersonate another business or person</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorised access to other accounts</li>
                <li>Use the platform to send spam or unsolicited emails</li>
                <li>Engage in money laundering or other financial crimes</li>
                <li>Resell or sublicense access to the platform</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your data and content</h2>
              <p>
                You retain ownership of all data you enter into TuaKa including client information,
                invoices, and business data. By using TuaKa, you grant us a limited licence to
                store and process this data solely to provide the service to you.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Service availability</h2>
              <p>
                We aim to maintain 99% uptime but do not guarantee uninterrupted access.
                We may perform maintenance that temporarily interrupts the service. We are
                not liable for losses caused by service downtime.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of liability</h2>
              <p>
                TuaKa is provided "as is" without warranty of any kind. We are not liable for
                any indirect, incidental, or consequential damages arising from your use of
                the platform. Our total liability to you shall not exceed the amount you paid
                us in the 3 months preceding the claim.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>
                You may cancel your account at any time from the billing settings page.
                We reserve the right to suspend or terminate accounts that violate these
                terms, with or without notice. Upon termination, your data will be retained
                for 30 days before deletion.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to terms</h2>
              <p>
                We may update these Terms of Service. We will notify you of material changes
                by email at least 14 days before they take effect. Continued use of TuaKa
                after changes constitutes acceptance.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Governing law</h2>
              <p>
                These terms are governed by the laws of the Republic of Ghana. Any disputes
                shall be resolved in the courts of Ghana.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
              <p>For questions about these terms:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>TuaKa</strong></p>
                <p>Email: legal@tuaka.org</p>
                <p>Website: https://tuaka.org</p>
              </div>
            </section>
  
          </div>
        </div>
  
        {/* Footer */}
        <div className="text-center py-8 text-xs text-gray-400">
          © {new Date().getFullYear()} TuaKa. All rights reserved.
        </div>
      </div>
    )
  }