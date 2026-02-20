import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Refuje",
  description: "Terms and conditions for Refuje Experiences Private Limited.",
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-desktop.png"
          alt="Terms and Conditions"
          fill
          priority
          className="hidden md:block object-cover"
        />
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-mobile.png"
          alt="Terms and Conditions"
          fill
          priority
          className="block md:hidden object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[40px] font-bold text-white tracking-[3px] uppercase text-center">
            Terms &amp; Conditions
          </h1>
        </div>
      </div>

      {/* Content */}
      <article className="px-5 md:px-10 py-12 md:py-20 max-w-[800px] mx-auto">
        <div className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px] space-y-6">
          {/* Introduction */}
          <p>
            <strong>Effective Date:</strong> 2 November 2025
          </p>
          <p>
            These Terms &amp; Conditions govern your use of our website(s) and
            participation in Refuje experiences. By using the Site or making a
            booking, you agree to these Terms.
          </p>
          <p>
            <strong>Company:</strong> Refuje Experiences Private Limited
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>
            <br />
            <strong>Address:</strong> G+1 Rear Unit, Chauhan Enclave, Apple
            Garden, Near SSB training centre, Kasumpti, Shimla, HP
          </p>
          <p>
            <strong>Grievance Officer:</strong> Rajesh Thakur
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:myrefuje@icould.com" className="text-[#A56014]">
              myrefuje@icould.com
            </a>
            <br />
            <strong>Phone:</strong> +91-7807740707
          </p>

          {/* 1. Scope & Definitions */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            1. Scope &amp; Definitions
          </h2>
          <p>
            <strong>&quot;Site&quot;</strong> refers to the website(s) operated
            by Refuje Experiences Private Limited, including all subdomains,
            mobile versions, and associated digital platforms.
          </p>
          <p>
            <strong>&quot;Experience&quot;</strong> means any activity, event,
            tour, or programme offered by Refuje, spanning the following 13
            themes: Camping, Culinary, Culture, Cycling/E-Biking, Expeditions,
            Hiking, Local Life, Photography, Riding &amp; Driving, Slow &amp;
            Chill, Solace, Stargazing, and Wildlife.
          </p>
          <p>
            <strong>&quot;Participant&quot;</strong> means any individual who
            books, registers for, or takes part in an Experience.
          </p>
          <p>
            <strong>&quot;Third-Party Provider&quot;</strong> means any
            independent supplier, vendor, or service provider engaged by Refuje
            to deliver part of an Experience, including but not limited to
            transport operators, accommodation providers, local guides, and
            equipment suppliers.
          </p>
          <p>
            <strong>&quot;Minor&quot;</strong> means any individual under the age
            of 18 years.
          </p>

          {/* 2. Using the Site */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            2. Using the Site
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account. You agree to provide accurate, current, and complete
            information during registration and booking.
          </p>
          <p>
            The Site and its content may be updated, modified, or withdrawn at
            any time without prior notice. We do not guarantee that the Site will
            be available at all times or free from errors.
          </p>
          <p>
            You agree not to use the Site for any unlawful purpose, to interfere
            with its operation, to attempt unauthorised access to any part of the
            Site or its systems, or to transmit harmful code, spam, or
            misleading content.
          </p>

          {/* 3. Booking & Contract Formation */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            3. Booking &amp; Contract Formation
          </h2>
          <p>
            A binding contract between you and Refuje is formed only upon our
            written confirmation of your booking, which may be issued via email
            or displayed on the booking confirmation page, following successful
            payment or deposit. Submission of a booking request or payment alone
            does not constitute a confirmed reservation.
          </p>
          <p>
            We reserve the right to decline or cancel any booking for safety,
            operational, or regulatory reasons. In such cases, any payments made
            will be refunded in full.
          </p>

          {/* 4. Prices, Taxes & Payments */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            4. Prices, Taxes &amp; Payments
          </h2>
          <p>
            All prices are quoted in Indian Rupees (INR) unless otherwise stated.
            Applicable taxes, fees, and surcharges will be displayed at checkout
            and are the responsibility of the Participant.
          </p>
          <p>
            We reserve the right to update pricing at any time; however,
            confirmed bookings will be honoured at the price quoted at the time
            of confirmation. Payments are processed through secure third-party
            payment gateways. In the event of suspected fraud or unauthorised
            transactions, we reserve the right to withhold services, cancel
            bookings, and initiate investigations.
          </p>

          {/* 5. Eligibility & Participation */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            5. Eligibility &amp; Participation
          </h2>
          <p>
            Age requirements vary by Experience and are specified on each
            Experience&apos;s listing page. Minors must be accompanied by a
            parent or legal guardian who assumes full responsibility for the
            minor&apos;s participation, safety, and conduct.
          </p>
          <p>
            Participants must accurately disclose their fitness level, medical
            conditions, allergies, and any limitations that may affect their
            ability to safely participate. Failure to disclose may result in
            exclusion from the Experience without refund.
          </p>
          <p>
            For self-drive Experiences (including but not limited to cycling,
            e-biking, riding, and driving), Participants must hold a valid and
            appropriate licence where required and must comply with all
            applicable road safety laws.
          </p>

          {/* 6. Safety, Equipment & Conduct */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            6. Safety, Equipment &amp; Conduct
          </h2>
          <p>
            <strong>Mandatory gear:</strong> Participants must use all required
            safety equipment as specified for each Experience, which may include
            helmets, headlamps, appropriate footwear, and seatbelts. Failure to
            comply may result in exclusion without refund.
          </p>
          <p>
            <strong>Prohibited activities:</strong> The consumption or possession
            of alcohol, recreational drugs, or any intoxicating substances is
            strictly prohibited during all Experiences. Participants found in
            violation will be removed immediately without refund.
          </p>
          <p>
            <strong>Fire &amp; campsite rules:</strong> All Participants must
            adhere to Leave No Trace principles. Open fires are permitted only
            where explicitly authorised by Refuje staff. All waste must be
            carried out and disposed of responsibly.
          </p>
          <p>
            <strong>Wildlife distancing:</strong> Participants must maintain safe
            distances from wildlife at all times and follow the instructions of
            Experience leaders and local guides.
          </p>
          <p>
            <strong>Cultural respect:</strong> Participants are expected to
            respect local customs, traditions, sacred sites, and communities
            throughout the Experience.
          </p>
          <p>
            <strong>Drone limitations:</strong> The use of drones or unmanned
            aerial vehicles is prohibited unless prior written approval has been
            obtained from Refuje and all applicable regulatory permissions are in
            place.
          </p>
          <p>
            <strong>Food allergy disclosure:</strong> Participants must disclose
            all food allergies and dietary restrictions at the time of booking.
            While we make reasonable efforts to accommodate dietary needs, we
            cannot guarantee the absence of allergens.
          </p>
          <p>
            <strong>Enforcement:</strong> Refuje reserves the right to remove
            any Participant who violates these conduct rules, endangers
            themselves or others, or disrupts the Experience, without refund or
            compensation.
          </p>

          {/* 7. Itineraries, Conditions & Authority Restrictions */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            7. Itineraries, Conditions &amp; Authority Restrictions
          </h2>
          <p>
            Routes, timings, inclusions, venues, and activities described in
            Experience listings are indicative and may be modified due to
            weather, visibility, wildlife activity, trail conditions, authority
            restrictions, or other factors beyond our reasonable control. Where
            changes are made, we will endeavour to provide equivalent
            substitutions where feasible.
          </p>

          {/* 8. Changes & Cancellations by You */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            8. Changes &amp; Cancellations by You
          </h2>
          <p>
            If you wish to change or cancel your booking, please refer to our
            separate{" "}
            <Link
              href="/cancellation-policy"
              className="text-[#A56014]"
            >
              Cancellation &amp; Rescheduling Policy
            </Link>
            , which sets out applicable timelines, refund entitlements, and
            credit options.
          </p>

          {/* 9. Changes, Rescheduling & Cancellations by Us */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            9. Changes, Rescheduling &amp; Cancellations by Us
          </h2>
          <p>
            Refuje may cancel, reschedule, or modify an Experience due to force
            majeure events, severe weather, safety concerns, authority
            restrictions, or failure to meet minimum participant numbers. In such
            cases, we will offer you the choice of a free reschedule to an
            alternative date or a full refund/credit.
          </p>

          {/* 10. Third-Party Providers & Authorities */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            10. Third-Party Providers &amp; Authorities
          </h2>
          <p>
            Certain components of our Experiences are delivered by independent
            third-party suppliers, including transport operators, accommodation
            providers, and local guides. These suppliers operate under their own
            terms and conditions. Refuje is not responsible for the acts,
            omissions, defaults, or negligence of any Third-Party Provider or
            governmental authority that are outside our reasonable control.
          </p>

          {/* 11. Risk Notice & Assumption of Risk */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            11. Risk Notice &amp; Assumption of Risk
          </h2>
          <p>
            Experiences take place in outdoor and adventure environments that
            carry inherent risks, including but not limited to unpredictable
            weather, rugged terrain, altitude, wildlife encounters, river
            crossings, and equipment-related incidents. These risks cannot be
            entirely eliminated.
          </p>
          <p>
            By participating, you confirm that you are in adequate physical and
            mental fitness for the chosen Experience, that you will comply with
            all safety instructions provided by Experience leaders, and that you
            voluntarily assume all inherent risks associated with participation.
          </p>
          <p>
            Experience leaders retain full discretion to modify activities,
            alter routes, or exclude Participants for safety reasons. You are
            responsible for the proper use and care of any equipment provided.
          </p>
          <p>
            In the event of an emergency, you authorise Refuje and its staff to
            arrange or administer first aid, evacuation, or medical treatment on
            your behalf where you are unable to provide consent.
          </p>

          {/* 12. Insurance */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            12. Insurance
          </h2>
          <p>
            Participants in adventure Experiences (including but not limited to
            cycling, expeditions, and select hiking activities) are required to
            hold comprehensive personal travel insurance that covers adventure
            activities, medical emergencies, evacuation, and personal liability.
            The onus of obtaining and maintaining adequate insurance rests
            entirely with the Participant. Refuje does not provide personal
            insurance coverage for Participants.
          </p>

          {/* 13. Liability, Risk Allocation & Indemnity */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            13. Liability, Risk Allocation &amp; Indemnity
          </h2>
          <p>
            <strong>Liability cap:</strong> Refuje&apos;s total aggregate
            liability to any Participant, for any and all claims arising from or
            related to an Experience, shall not exceed the total fees paid by
            that Participant for the specific Experience giving rise to the
            claim.
          </p>
          <p>
            <strong>Excluded damages:</strong> To the maximum extent permitted by
            law, Refuje shall not be liable for any indirect, incidental,
            consequential, special, or punitive damages, including loss of
            enjoyment, loss of data, or loss of revenue, howsoever arising.
          </p>
          <p>
            <strong>Force majeure:</strong> Refuje shall not be liable for any
            failure or delay in performance resulting from circumstances beyond
            our reasonable control, as described in Section 19 below.
          </p>
          <p>
            <strong>Risk acknowledgement:</strong> By booking an Experience, you
            acknowledge the inherent risks described in Section 11 and agree
            that Refuje has made these risks known to you.
          </p>
          <p>
            <strong>Waiver &amp; release:</strong> To the fullest extent
            permitted by applicable law, you waive and release Refuje, its
            directors, officers, employees, agents, and partners from any and
            all claims, demands, losses, damages, and liabilities arising from
            your participation in an Experience.
          </p>
          <p>
            <strong>Indemnification:</strong> You agree to indemnify and hold
            harmless Refuje and its affiliates from any claims, losses, damages,
            costs, or expenses (including reasonable legal fees) arising from
            your breach of these Terms, your negligence or misconduct, or your
            violation of any applicable law.
          </p>
          <p>
            <strong>Consumer protection:</strong> Nothing in these Terms is
            intended to exclude or limit any rights that cannot be excluded or
            limited under applicable consumer protection legislation.
          </p>

          {/* 14. Accessibility & Special Needs */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            14. Accessibility &amp; Special Needs
          </h2>
          <p>
            Refuje makes reasonable efforts to adapt Experiences for
            Participants with accessibility requirements or special needs. To
            allow us to make appropriate arrangements, please communicate any
            accessibility or special needs requirements in advance at the time of
            booking. While we strive to accommodate all requests, the nature of
            certain outdoor and adventure activities may impose limitations.
          </p>

          {/* 15. Property, Equipment & Lost Items */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            15. Property, Equipment &amp; Lost Items
          </h2>
          <p>
            Participants are liable for any wilful or negligent damage to
            property or equipment provided by Refuje or its Third-Party
            Providers during an Experience. Refuje is not responsible for
            personal belongings, valuables, or equipment that are lost,
            abandoned, stolen, or damaged during an Experience. Items left behind
            will be held for a reasonable period, after which they may be
            disposed of.
          </p>

          {/* 16. Intellectual Property */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            16. Intellectual Property
          </h2>
          <p>
            All content on the Site, including text, photographs, graphics,
            logos, videos, icons, and design elements, is the property of Refuje
            Experiences Private Limited or its licensors and is protected by
            applicable intellectual property laws. No content may be copied,
            reproduced, distributed, republished, or modified without prior
            written consent, except for personal, non-commercial use.
          </p>

          {/* 17. User-Generated Content & Media */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            17. User-Generated Content &amp; Media
          </h2>
          <p>
            By submitting photographs, videos, reviews, testimonials, or other
            content to Refuje (whether via the Site, email, social media, or
            during an Experience), you grant Refuje a non-exclusive,
            royalty-free, worldwide, perpetual licence to use, reproduce, modify,
            adapt, publish, and display such content for marketing, promotional,
            and editorial purposes across any media.
          </p>
          <p>
            If you do not wish your likeness or content to be used, you may opt
            out by notifying us in writing at{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>{" "}
            before or during the Experience.
          </p>

          {/* 18. Privacy */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            18. Privacy
          </h2>
          <p>
            Your personal data is collected, used, and protected in accordance
            with our{" "}
            <Link href="/privacy-policy" className="text-[#A56014]">
              Privacy Policy
            </Link>
            , which forms part of these Terms. Please review it carefully to
            understand how we handle your information.
          </p>

          {/* 19. Force Majeure */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            19. Force Majeure
          </h2>
          <p>
            Refuje shall not be liable for any failure or delay in performing its
            obligations where such failure or delay results from events beyond
            our reasonable control, including but not limited to: extreme or
            unseasonal weather, natural disasters, landslides, wildfires,
            earthquakes, floods, government orders or restrictions, road
            closures, curfews, military operations, strikes, labour disputes,
            epidemics, pandemics, infrastructure failures, power outages, and
            communication breakdowns.
          </p>

          {/* 20. Governing Law & Dispute Resolution */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            20. Governing Law &amp; Dispute Resolution
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of India. Any dispute, claim, or controversy arising out of or
            relating to these Terms or your participation in an Experience shall
            be subject to the exclusive jurisdiction of the courts located in
            Shimla, Himachal Pradesh, India.
          </p>

          {/* 21. Changes to These Terms */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            21. Changes to These Terms
          </h2>
          <p>
            Refuje reserves the right to update, modify, or replace these Terms
            at any time. Changes become effective immediately upon posting to the
            Site. Continued use of the Site or participation in Experiences after
            any changes constitutes acceptance of the revised Terms. We
            encourage you to review these Terms periodically.
          </p>

          {/* 22. Contact */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            22. Contact
          </h2>
          <p>
            For questions, concerns, or requests regarding these Terms, please
            contact us:
          </p>
          <p>
            <strong>Refuje Experiences Private Limited</strong>
            <br />
            G+1 Rear Unit, Chauhan Enclave, Apple Garden, Near SSB training
            centre, Kasumpti, Shimla, HP
            <br />
            Email:{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>
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
        </div>
      </article>
    </>
  );
}
