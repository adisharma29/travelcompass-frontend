import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cancellation Policy | Refuje",
  description:
    "Cancellation and rescheduling policy for Refuje experiences booked directly through our website.",
};

export default function CancellationPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Desktop hero */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-desktop.png"
          alt="Cancellation Policy"
          fill
          priority
          className="object-cover hidden md:block"
        />
        {/* Mobile hero */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-mobile.png"
          alt="Cancellation Policy"
          fill
          priority
          className="object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[40px] font-bold text-white tracking-[3px] uppercase">
            Cancellation Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="px-5 md:px-10 py-12 md:py-20 max-w-[800px] mx-auto">
        <div className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px] space-y-6">
          {/* Sub-heading & intro */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            Website Cancellation &amp; Rescheduling Policy
          </h2>
          <p>
            <strong>Effective Date:</strong> November 2, 2025
          </p>
          <p>
            <strong>Time Zone:</strong> All times referenced in this policy are
            in India Standard Time (IST, UTC+05:30).
          </p>
          <p>
            This policy covers bookings made directly through our website,
            email, phone, WhatsApp, or in-person. Bookings made through
            third-party platforms (such as Airbnb Experiences, Viator, or
            GetYourGuide) are governed by the respective platform&apos;s
            cancellation terms and must be managed through that platform.
          </p>

          {/* 1. How to Request Changes */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            1. How to Request Changes
          </h2>
          <p>
            To request a cancellation, reschedule, or any modification to your
            booking, email{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>{" "}
            with the following details:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your full name and booking confirmation number</li>
            <li>The experience name and scheduled date</li>
            <li>Your desired action (cancel, reschedule, or modify)</li>
          </ul>
          <p>
            Requests are timestamped upon receipt. Response times may vary but
            we aim to acknowledge all requests within 24 hours.
          </p>

          {/* 2. Definitions */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            2. Definitions
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Single-Day Experience:</strong> Any activity that begins
              and ends on the same calendar day (e.g., day hikes, cycling
              tours, cultural walks, food experiences).
            </li>
            <li>
              <strong>Multi-Day / Overnight / Expedition:</strong> Any activity
              spanning two or more calendar days, or involving overnight stays,
              camping, or extended expeditions.
            </li>
            <li>
              <strong>Non-Recoverable Costs:</strong> Expenses already incurred
              by Refuje on your behalf that cannot be reversed, such as permits,
              accommodation deposits, transport bookings, or equipment
              reservations.
            </li>
            <li>
              <strong>Reschedule:</strong> Moving your confirmed booking to a
              different date or time slot for the same experience, subject to
              availability.
            </li>
            <li>
              <strong>No-Show:</strong> Failure to arrive at the designated
              meeting point within the allowed check-in window without prior
              cancellation or communication.
            </li>
          </ul>

          {/* 3. Single-Day Experience Cancellations */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            3. Single-Day Experience Cancellations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#C9B29D]">
                  <th className="py-3 pr-4 font-bold">Timing</th>
                  <th className="py-3 pr-4 font-bold">Refund</th>
                  <th className="py-3 pr-4 font-bold">Credit</th>
                  <th className="py-3 font-bold">Reschedule Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">More than 7 days before</td>
                  <td className="py-3 pr-4">100% refund</td>
                  <td className="py-3 pr-4">or 100% credit (1-year validity)</td>
                  <td className="py-3">No fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">1&ndash;7 days before</td>
                  <td className="py-3 pr-4">75% refund</td>
                  <td className="py-3 pr-4">or 100% credit</td>
                  <td className="py-3">No fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">12&ndash;24 hours before</td>
                  <td className="py-3 pr-4">50% refund</td>
                  <td className="py-3 pr-4">or 75% credit</td>
                  <td className="py-3">25% fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">0&ndash;12 hours before</td>
                  <td className="py-3 pr-4">No refund</td>
                  <td className="py-3 pr-4">or 50% credit</td>
                  <td className="py-3">50% fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">No-show</td>
                  <td className="py-3 pr-4">No refund</td>
                  <td className="py-3 pr-4">&mdash;</td>
                  <td className="py-3">100% fee</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Multi-Day / Expedition Cancellations */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            4. Multi-Day / Expedition Cancellations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#C9B29D]">
                  <th className="py-3 pr-4 font-bold">Timing</th>
                  <th className="py-3 pr-4 font-bold">Refund</th>
                  <th className="py-3 pr-4 font-bold">Credit</th>
                  <th className="py-3 font-bold">Reschedule Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">More than 7 days before</td>
                  <td className="py-3 pr-4">100% refund</td>
                  <td className="py-3 pr-4">or 100% credit</td>
                  <td className="py-3">No fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">1&ndash;7 days before</td>
                  <td className="py-3 pr-4">50% refund</td>
                  <td className="py-3 pr-4">or 75% credit</td>
                  <td className="py-3">25% fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">Less than 24 hours</td>
                  <td className="py-3 pr-4">No refund</td>
                  <td className="py-3 pr-4">or 50% credit</td>
                  <td className="py-3">50% fee</td>
                </tr>
                <tr className="border-b border-[#C9B29D]/30">
                  <td className="py-3 pr-4">No-show</td>
                  <td className="py-3 pr-4">No refund</td>
                  <td className="py-3 pr-4">&mdash;</td>
                  <td className="py-3">100% fee</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. Rescheduling Rules */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            5. Rescheduling Rules
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Free reschedules are available within the eligible cancellation
              windows listed above (where &ldquo;No fee&rdquo; is indicated).
            </li>
            <li>
              Name transfers are permitted up to 24 hours before the experience
              start time at no additional cost.
            </li>
            <li>
              Paid reschedules (where a fee applies) are subject to
              availability. If the desired date is not available, a credit will
              be issued instead.
            </li>
            <li>
              If the rescheduled experience is priced higher than the original
              booking, the price difference must be paid at the time of
              rescheduling. No refund is issued if the rescheduled experience is
              priced lower.
            </li>
          </ul>

          {/* 6. Weather, Safety & Authority Controls */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            6. Weather, Safety &amp; Authority Controls
          </h2>
          <p>
            If Refuje determines that weather conditions, safety concerns, or
            authority restrictions (e.g., forest department closures, permit
            revocations, road blocks) prevent safe delivery of the experience,
            we will:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Offer a free reschedule to the next available date, or
            </li>
            <li>
              Issue a full refund or 100% credit (your choice).
            </li>
          </ul>
          <p>
            The decision to cancel for safety reasons rests solely with Refuje
            and is final. No reschedule fees apply in these circumstances.
          </p>

          {/* 7. Minimum Group Size */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            7. Minimum Group Size
          </h2>
          <p>
            Some experiences require a minimum number of participants to
            operate. If the minimum is not met, we will offer the following
            options:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Reschedule to a date when the group size is met</li>
            <li>Merge with another group on a nearby date</li>
            <li>
              Proceed as a private experience with a supplement (quoted in
              advance)
            </li>
            <li>Receive a full credit toward a future booking</li>
          </ul>

          {/* 8. Late Arrivals & No-Shows */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            8. Late Arrivals &amp; No-Shows
          </h2>
          <p>
            <strong>Group experiences:</strong> A grace period of 15 minutes
            from the scheduled start time is provided. After 15 minutes, the
            group will depart and the booking will be treated as a no-show.
          </p>
          <p>
            <strong>Private experiences:</strong> A grace period of 30 minutes
            from the scheduled start time is provided. After 30 minutes, the
            experience will be cancelled and the booking will be treated as a
            no-show.
          </p>
          <p>
            No-shows are not eligible for refunds. See the tables above for
            no-show reschedule fees.
          </p>

          {/* 9. Special Components & Add-Ons */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            9. Special Components &amp; Add-Ons
          </h2>
          <p>
            Certain components of an experience may be governed by separate or
            additional terms:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Permits:</strong> Government-issued permits (e.g., forest
              entry, wildlife sanctuary, restricted area) are non-refundable
              once procured.
            </li>
            <li>
              <strong>Accommodation:</strong> Hotel, homestay, or campsite
              bookings made on your behalf are subject to the property&apos;s
              own cancellation terms.
            </li>
            <li>
              <strong>Equipment rental:</strong> Rented gear (bikes, camping
              equipment, etc.) is subject to rental-specific cancellation
              terms communicated at the time of booking.
            </li>
            <li>
              <strong>Self-drive components:</strong> Vehicle rentals included
              in self-drive experiences are governed by the vehicle
              provider&apos;s terms and conditions.
            </li>
          </ul>

          {/* 10. Refund Processing */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            10. Refund Processing
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Refunds are processed to the original payment method used at
              the time of booking.
            </li>
            <li>
              Please allow 5&ndash;10 business days for the refund to reflect
              in your account, depending on your bank or payment provider.
            </li>
            <li>
              Payment gateway fees and transaction charges are non-refundable.
            </li>
          </ul>

          {/* 11. Credits & Gift Cards */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            11. Credits &amp; Gift Cards
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Credits issued under this policy are valid for 3&ndash;12 months
              from the date of issue, depending on the experience type and
              cancellation window.
            </li>
            <li>
              Credits are transferable one time to another person. The
              transfer must be communicated to us in writing before redemption.
            </li>
            <li>
              Gift cards purchased through our website are non-refundable but
              are transferable and can be applied toward any experience.
            </li>
          </ul>

          {/* 12. Third-Party Platform Bookings */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            12. Third-Party Platform Bookings
          </h2>
          <p>
            If you booked through a third-party platform (Airbnb Experiences,
            Viator, GetYourGuide, Klook, etc.), your cancellation and
            rescheduling must be processed through that platform in accordance
            with their terms and conditions. Refuje cannot override or modify
            third-party platform policies.
          </p>

          {/* 13. Exceptions & Discretion */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            13. Exceptions &amp; Discretion
          </h2>
          <p>
            Refuje reserves the right to offer goodwill reschedules or credits
            beyond what this policy stipulates, at our sole discretion, in
            cases of documented emergencies (e.g., medical emergencies,
            natural disasters, bereavement). Such exceptions are handled on a
            case-by-case basis and do not set a precedent for future requests.
          </p>

          {/* 14. Contact Information */}
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] pt-4">
            14. Contact Information
          </h2>
          <p>
            For any questions regarding this policy or to request changes to
            your booking:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:myrefuje@gmail.com" className="text-[#A56014]">
              myrefuje@gmail.com
            </a>
            <br />
            <strong>Phone:</strong> +91-7807740707
            <br />
            <strong>Address:</strong> Refuje Experiences Private Limited, G+1
            Rear Unit, Chauhan Enclave, Apple Garden, Near SSB Training Centre,
            Kasumpti, Shimla, HP 171002
          </p>
        </div>
      </article>
    </>
  );
}
