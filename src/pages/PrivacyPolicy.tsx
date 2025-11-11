import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
            <p className="mb-4">
              Revora Marketing collects personal information to provide effective marketing services to our clients and to generate leads through our own advertising campaigns. The types of information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information (name, email address, phone number, business address)</li>
              <li>Business information (company name, industry, service needs)</li>
              <li>Marketing preferences and interests</li>
              <li>Website usage data and analytics</li>
              <li>Information provided through forms, calls, or consultations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Client Services:</strong> To provide advertising and marketing services, including creating and managing ad campaigns on behalf of our clients</li>
              <li><strong>Lead Generation:</strong> To contact potential clients who have expressed interest in our services through our advertising campaigns</li>
              <li><strong>Sales Calls:</strong> To schedule and conduct sales consultations and follow-up communications</li>
              <li><strong>Marketing Communications:</strong> To send relevant marketing materials, updates, and promotional offers</li>
              <li><strong>Service Improvement:</strong> To analyze and improve our marketing strategies and service offerings</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Information Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Advertising Platforms:</strong> Information may be shared with advertising platforms (such as Google, Facebook, LinkedIn) to create and optimize ad campaigns</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in providing our services (CRM systems, email marketing platforms, analytics tools)</li>
              <li><strong>Clients:</strong> When we collect information on behalf of our clients for their marketing campaigns, that information may be shared with the client</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at garret@revoramarketingagency.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to analyze website traffic, understand user behavior, and improve our services. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, it will be securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Revora Marketing</strong></p>
              <p>Email: garret@revoramarketingagency.com</p>
              <p>Phone: (519) 717-9806</p>
              <p>Location: Toronto ON, Canada</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
