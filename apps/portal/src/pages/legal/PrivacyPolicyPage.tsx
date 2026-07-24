

export function PrivacyPolicyPage() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-logo text-gray-900">
              Tua<span className="text-brand-600">Ka</span>
            </a>
            <a href="/login" className="text-sm text-brand-500 hover:underline">
              Sign in
            </a>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>
  
          <div className="bg-white rounded-xl border border-gray-100 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                TuaKa ("we", "our", or "us") is committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, and safeguard your data when you
                use our invoicing and payment platform at tuaka.org.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Information we collect</h2>
              <p className="mb-3">We collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account information:</strong> Name, email address, business name, and password when you register.</li>
                <li><strong>Business information:</strong> Client details, invoice data, product and service information you enter into the platform.</li>
                <li><strong>Payment information:</strong> Mobile money numbers used for payments. We do not store full payment credentials — payments are processed by Paystack.</li>
                <li><strong>Usage data:</strong> Log files, IP addresses, browser type, and pages visited to help us improve the service.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and maintain the TuaKa platform</li>
                <li>To send invoices and payment notifications on your behalf</li>
                <li>To process subscription payments</li>
                <li>To send you service-related emails (verification, password reset, reminders)</li>
                <li>To improve our platform and fix errors</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data sharing</h2>
              <p className="mb-3">We do not sell your personal data. We share data only with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Paystack:</strong> For processing payments. Governed by Paystack's Privacy Policy.</li>
                <li><strong>Mailgun / Gmail:</strong> For sending transactional emails.</li>
                <li><strong>Sentry:</strong> For error monitoring. Error reports may include technical data.</li>
                <li><strong>DigitalOcean:</strong> Our cloud hosting provider where your data is stored.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data storage and security</h2>
              <p>
                Your data is stored on secure servers hosted by DigitalOcean in London, UK.
                We use industry-standard encryption (HTTPS/TLS) for all data in transit.
                Passwords are hashed and never stored in plain text. We regularly back up
                your data to prevent loss.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your rights</h2>
              <p className="mb-3">Under Ghana's Data Protection Act 2012, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Object to how we process your data</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, email us at <strong>privacy@tuaka.org</strong>.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Cookies</h2>
              <p>
                TuaKa uses minimal cookies and local storage to keep you logged in and
                remember your preferences. We do not use advertising or tracking cookies.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Data retention</h2>
              <p>
                We retain your data for as long as your account is active. If you delete
                your account, we will remove your personal data within 30 days, except
                where we are required to retain it for legal or financial compliance purposes.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Third-party links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible
                for the privacy practices of those sites and encourage you to review their
                privacy policies.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes by email or by posting a notice on the platform.
                Continued use of TuaKa after changes constitutes acceptance of the updated policy.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Contact us</h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your data:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>TuaKa</strong></p>
                <p>Email: privacy@tuaka.org</p>
                <p>Website: https://tuaka.org</p>
                <p>Ghana, West Africa</p>
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