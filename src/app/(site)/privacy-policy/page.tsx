import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy | Refuje",
  description: "Privacy policy for Refuje Experiences Private Limited.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Desktop hero */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-desktop.png"
          alt="Privacy Policy"
          fill
          priority
          className="object-cover hidden md:block"
        />
        {/* Mobile hero */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-mobile.png"
          alt="Privacy Policy"
          fill
          priority
          className="object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[40px] font-bold text-white tracking-[3px] uppercase text-center">
            Website Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="px-5 md:px-10 py-12 md:py-20 max-w-[800px] mx-auto">
        <div className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px] space-y-6">
          {/* Introduction */}
          <p>
            <strong>Effective Date:</strong> 2 November 2025
          </p>
          <p>
            This Website Privacy Policy (&quot;Policy&quot;) describes how{" "}
            <strong>Refuje Experiences Private Limited</strong>, operating as
            &quot;Refuje&quot; (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), collects, uses, shares, and protects your personal
            information when you visit our website{" "}
            <a
              href="https://refuje.com"
              className="text-[#A56014] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://refuje.com
            </a>{" "}
            or use our services.
          </p>
          <p>
            For questions or concerns, contact us at{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>
            .
          </p>
          <p>
            <strong>Registered Address:</strong> G+1 Rear Unit, Chauhan Enclave,
            Apple Garden, Near SSB training centre, Kasumpti, Shimla, HP
          </p>
          <p>
            <strong>Grievance Officer:</strong> Rajesh Thakur
            <br />
            Email:{" "}
            <a href="mailto:myrefuje@icould.com" className="text-[#A56014]">
              myrefuje@icould.com
            </a>
            <br />
            Phone: +91-7807740707
          </p>

          {/* 1. What We Collect */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            1. What We Collect
          </h2>
          <p>
            <strong>A. Direct Collection</strong>
          </p>
          <p>
            We collect information you provide directly, including identity and
            contact details (name, email, phone number, location), booking
            details (preferred dates, group size, age of participants), safety
            information (fitness level, medical conditions, allergies),
            government-issued identification where legally required, and
            communication records (emails, calls, messages).
          </p>
          <p>
            <strong>B. Automatic Collection</strong>
          </p>
          <p>
            When you use our website, we automatically collect device data, IP
            addresses, browser and device type, operating system information, and
            data through cookies and tracking pixels for site functionality and
            analytics.
          </p>
          <p>
            <strong>C. Third-Party Sources</strong>
          </p>
          <p>
            We may receive information from scheduling tools, payment processors,
            and analytics platforms used during the booking and service delivery
            process.
          </p>

          {/* 2. Purpose & Legal Basis */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            2. Purpose &amp; Legal Basis
          </h2>
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service provision:</strong> To fulfil bookings, deliver
              experiences, and manage your account.
            </li>
            <li>
              <strong>Safety &amp; logistics planning:</strong> To assess fitness
              requirements, manage medical or allergy needs, and ensure safe
              operations.
            </li>
            <li>
              <strong>Payment processing &amp; fraud prevention:</strong> To
              process transactions securely and prevent fraudulent activity.
            </li>
            <li>
              <strong>Customer communications:</strong> To send booking
              confirmations, updates, and respond to inquiries.
            </li>
            <li>
              <strong>Service improvement:</strong> To analyse usage patterns and
              improve our offerings and website experience.
            </li>
            <li>
              <strong>Marketing:</strong> To send promotional materials where you
              have given consent or where we have a legitimate interest.
            </li>
            <li>
              <strong>Legal compliance:</strong> To meet our obligations under
              applicable laws, including the Digital Personal Data Protection
              Act, 2023.
            </li>
          </ul>

          {/* 3. Children */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            3. Children
          </h2>
          <p>
            Under Indian privacy law, a &quot;Child&quot; is defined as an
            individual under the age of 18. We do not intentionally collect
            personal data from children without verifiable parental or guardian
            consent. If we become aware that we have collected data from a child
            without appropriate consent, we will take steps to delete such
            information promptly.
          </p>

          {/* 4. User Rights */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            4. User Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access</strong> the personal data we hold about you.
            </li>
            <li>
              <strong>Correct</strong> inaccurate or incomplete data.
            </li>
            <li>
              <strong>Erase</strong> your data, subject to legal retention
              requirements.
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time for processing based
              on consent.
            </li>
            <li>
              <strong>File grievances</strong> with the Data Protection Board of
              India if you believe your rights have been violated.
            </li>
          </ul>
          <p>
            If you are located in the EEA or UK, you retain all rights afforded
            under the General Data Protection Regulation (GDPR), including the
            right to data portability and the right to object to processing.
          </p>

          {/* 5. Data Sharing */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            5. Data Sharing
          </h2>
          <p>
            We may share your personal data with the following categories of
            recipients:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Vendors and processors:</strong> Third-party service
              providers who assist with payment processing, analytics, customer
              support, and communications.
            </li>
            <li>
              <strong>Operational partners:</strong> Local guides, accommodation
              providers, and transport partners necessary for delivering your
              experience.
            </li>
            <li>
              <strong>Legal authorities:</strong> Government bodies, regulators,
              or law enforcement when required by applicable law or legal
              process.
            </li>
            <li>
              <strong>Business transfer recipients:</strong> In connection with a
              merger, acquisition, or sale of assets, your data may be
              transferred to the acquiring entity.
            </li>
          </ul>

          {/* 6. International Transfers */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            6. International Transfers
          </h2>
          <p>
            Your data may be transferred to and processed in countries outside of
            India. We comply with the Digital Personal Data Protection Act, 2023,
            which adopts a &quot;negative list&quot; approach to international
            data transfers, permitting transfers to all jurisdictions except
            those specifically restricted by the Indian government. Where data is
            transferred to EEA/UK jurisdictions, we ensure compliance with
            applicable GDPR requirements.
          </p>

          {/* 7. Retention */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            7. Retention
          </h2>
          <p>
            We retain your personal data only for as long as necessary to fulfil
            the purposes for which it was collected, including satisfying any
            legal, accounting, or reporting requirements. Once the purpose has
            been served or you withdraw consent, we will erase or anonymise your
            data unless retention is required by law.
          </p>

          {/* 8. Cookies & Tracking */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            8. Cookies &amp; Tracking
          </h2>
          <p>We use the following types of cookies and tracking technologies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential cookies:</strong> Required for the website to
              function properly, including session management and security.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how visitors
              interact with our website, enabling us to improve performance and
              user experience.
            </li>
            <li>
              <strong>Marketing cookies:</strong> Used to deliver relevant
              advertisements and measure campaign effectiveness.
            </li>
          </ul>
          <p>
            You can control cookie preferences through your browser settings.
            Most browsers allow you to block or delete cookies. You may also
            opt-out of targeted advertising through industry opt-out mechanisms.
            Please note that disabling certain cookies may affect site
            functionality.
          </p>

          {/* 9. Security */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            9. Security
          </h2>
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal data, including encryption of data in transit
            and at rest, access controls to limit data access to authorised
            personnel, and regular security assessments. In the event of a data
            breach that poses a risk to your rights and freedoms, we will notify
            you and the relevant authorities in accordance with applicable law.
          </p>

          {/* 10. Marketing Choices */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            10. Marketing Choices
          </h2>
          <p>
            You can unsubscribe from marketing communications at any time by
            using the unsubscribe link included in our messages or by contacting
            us directly at{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>
            . Please note that even after opting out of marketing, you may still
            receive transactional or service-related communications.
          </p>

          {/* 11. Rights Exercise & Complaints */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            11. Rights Exercise &amp; Complaints
          </h2>
          <p>To exercise your data rights or file a complaint, you may:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Email us:</strong>{" "}
              <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
                myrefuje@gmail.com
              </a>
            </li>
            <li>
              <strong>Contact our Grievance Officer:</strong> Rajesh Thakur at{" "}
              <a href="mailto:myrefuje@icould.com" className="text-[#A56014]">
                myrefuje@icould.com
              </a>{" "}
              or +91-7807740707
            </li>
            <li>
              <strong>Write to us:</strong> Refuje Experiences Private Limited,
              G+1 Rear Unit, Chauhan Enclave, Apple Garden, Near SSB training
              centre, Kasumpti, Shimla, HP
            </li>
            <li>
              <strong>Escalate to the Data Protection Board:</strong> If you are
              unsatisfied with our response, you may escalate your complaint to
              the Data Protection Board of India.
            </li>
          </ul>

          {/* 12. Policy Changes */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            12. Policy Changes
          </h2>
          <p>
            We may update this Policy from time to time to reflect changes in our
            practices, legal requirements, or operational needs. Where material
            changes are made, we will provide prominent notice on our website or
            through direct communication. We encourage you to review this Policy
            periodically to stay informed about how we protect your information.
          </p>

          {/* 13. Jurisdiction-Specific Notices */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            13. Jurisdiction-Specific Notices
          </h2>
          <p>
            <strong>India:</strong> This Policy is designed to comply with the
            Digital Personal Data Protection Act, 2023 (DPDP Act). We act as a
            &quot;Data Fiduciary&quot; under the DPDP Act and process your data
            in accordance with the principles of purpose limitation, data
            minimisation, and storage limitation outlined therein.
          </p>
          <p>
            <strong>EEA/UK:</strong> For users in the European Economic Area and
            the United Kingdom, Refuje Experiences Private Limited acts as the
            data controller. We process your data under GDPR-recognised legal
            bases, including consent, contract performance, legitimate interests,
            and legal obligation. You may exercise your GDPR rights by contacting
            us at the details provided above.
          </p>
        </div>
      </article>
    </>
  );
}
