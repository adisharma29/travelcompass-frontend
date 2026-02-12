"use client";

import { AccordionSection } from "@/components/site/AccordionSection";

const sections = [
  {
    heading: "Planning & Booking",
    items: [
      {
        title: "How do I book an experience?",
        content:
          "You can book directly via the Experience page on our website, by emailing myrefuje@gmail.com, or through our WhatsApp widget. Select your preferred date, choose the number of guests, and complete the checkout process to confirm your slot.",
      },
      {
        title: "Do you hold slots without payment?",
        content:
          "We don\u2019t hold slots without payment. Inventory is limited and demand fluctuates, so we strongly recommend booking early to avoid disappointment. A confirmed booking requires full or partial payment depending on the experience.",
      },
      {
        title: "Are prices fixed or do they change?",
        content:
          "Prices are dynamic and may vary by date, season, group size, and availability. The price displayed on the Experience page at the time of booking is the applicable rate. We do not retroactively adjust pricing for confirmed bookings.",
      },
      {
        title: "Can I book a private departure?",
        content:
          "Yes, private departures are available for most experiences. Minimum group charges or surcharges may apply depending on the experience type and location. Contact us with your preferred dates and group size for a custom quote.",
      },
      {
        title: "Can solo travelers join?",
        content:
          "Absolutely \u2014 solo travelers are welcome and can join any scheduled departure that has availability. Many of our guests travel solo and find it a great way to meet like-minded people. No single supplements apply on group departures.",
      },
      {
        title: "Do I need to arrange my own travel to the starting point?",
        content:
          "Yes, unless stated otherwise on the Experience page, travel to and from the meeting point is your responsibility. Each experience listing includes detailed directions and transport recommendations. We can also help arrange transfers on request at additional cost.",
      },
    ],
  },
  {
    heading: "Payments & Invoices",
    items: [
      {
        title: "What payment methods are accepted?",
        content:
          "We accept credit/debit cards (Visa, Mastercard, Amex, RuPay), UPI, and net-banking via our payment partners. Bank transfers (NEFT/RTGS/IMPS) are also available for bookings made directly through our team.",
      },
      {
        title: "Can I get a GST invoice?",
        content:
          "Yes, GST invoices are provided upon request. Please share your company name, GSTIN, and billing address at the time of booking or within 48 hours of payment. Invoices are typically issued within 3\u20135 business days.",
      },
      {
        title: "Are there any foreign exchange or cross-border fees?",
        content:
          "All listed prices are in Indian Rupees (INR). If you pay from an international card or bank account, your issuing bank may apply foreign exchange conversion fees or cross-border transaction charges. These are outside our control and are borne by the guest.",
      },
    ],
  },
  {
    heading: "Changes, Cancellations & Credits",
    items: [
      {
        title: "What is the cancellation policy?",
        content:
          "Cancellation terms vary by experience and are detailed on the specific Experience page and in our full Cancellation Policy. Generally, cancellations made well in advance receive a higher refund or credit, while last-minute cancellations may be non-refundable. Please review the policy before booking.",
      },
      {
        title: "Can I reschedule my booking to a different date?",
        content:
          "Rescheduling is subject to availability and must be requested before the cancellation window closes. Date changes are treated as a cancellation of the original booking and a new booking for the alternate date. Any price difference for the new date will apply.",
      },
      {
        title: "How do Refuje credits work?",
        content:
          "When a cancellation qualifies for credit instead of a cash refund, we issue Refuje credits to your account. Credits are valid for a specified period (noted at issuance) and can be applied toward any future experience. Credits are non-transferable and cannot be redeemed for cash.",
      },
      {
        title: "I booked through a third-party platform (OTA). How do I modify or cancel?",
        content:
          "If you booked through a third-party platform such as a travel aggregator, modifications and cancellations must be processed through that platform. Their policies and timelines apply. We recommend contacting both the platform and our team for guidance.",
      },
    ],
  },
  {
    heading: "Eligibility, Age & Fitness",
    items: [
      {
        title: "What is the minimum age to participate?",
        content:
          "Minimum age varies by experience type. Adventure activities typically require participants to be at least 14\u201318 years old, while family-friendly experiences may allow younger children with a guardian. The specific age requirement is listed on each Experience page.",
      },
      {
        title: "Do I need to be very fit to join?",
        content:
          "Fitness expectations depend on the experience. Some activities like high-altitude treks and cycling expeditions require moderate to good fitness, while others like camping, stargazing, and cultural immersions are suitable for most fitness levels. Each listing includes a difficulty rating and fitness guidance.",
      },
      {
        title: "Do I need to disclose medical conditions?",
        content:
          "Yes, all medical conditions, allergies, chronic illnesses, medications, and physical limitations must be disclosed before the activity. This is essential for your safety and allows our leaders to make appropriate arrangements. Non-disclosure may result in being excluded from an activity without a refund.",
      },
      {
        title: "Are experiences accessible for people with disabilities?",
        content:
          "Accessibility is assessed on a case-by-case basis depending on the location, terrain, and safety requirements of each experience. We are committed to inclusion wherever feasible. Please contact us in advance so we can evaluate and discuss the best options for you.",
      },
    ],
  },
  {
    heading: "Safety, Insurance & Conduct",
    items: [
      {
        title: "Is travel or activity insurance required?",
        content:
          "For adventure-classified activities (trekking, cycling, climbing, etc.), personal travel insurance covering the specific activity is strongly recommended and may be mandatory. Please check the Experience page for insurance requirements. Refuje does not provide personal insurance on behalf of guests.",
      },
      {
        title: "What safety gear is provided?",
        content:
          "Mandatory safety gear such as helmets, harnesses, and life jackets is provided by Refuje where required and its use is strictly enforced during all activities. Participants who refuse to use provided safety equipment will not be allowed to participate.",
      },
      {
        title: "What is the alcohol and substance policy?",
        content:
          "Alcohol and recreational drugs are strictly prohibited before and during all activities. Participants found under the influence will be immediately excluded from the activity without a refund. This policy is non-negotiable and exists for the safety of all participants.",
      },
      {
        title: "Are your trip leaders qualified?",
        content:
          "All Refuje experience leaders are trained professionals with relevant certifications and local expertise. Adventure activity leaders hold wilderness first-aid qualifications and activity-specific certifications. Our leaders have extensive experience operating in the regions where our experiences take place.",
      },
    ],
  },
  {
    heading: "Gear & What to Bring",
    items: [
      {
        title: "What is included in the experience price?",
        content:
          "Each experience listing specifies exactly what is included (e.g., meals, accommodation, equipment, guided activities, permits) and what is not. Please review the Inclusions and Exclusions section on the Experience page carefully before booking.",
      },
      {
        title: "Do I need to bring my own gear?",
        content:
          "For most experiences, specialised equipment is provided by Refuje. Personal items such as clothing, footwear, sunscreen, medications, and daypack should be brought by you. Some experiences may require specific personal gear \u2014 check the packing list provided after booking.",
      },
      {
        title: "Will I receive a packing list?",
        content:
          "Yes, a detailed packing list and preparation guide is shared via email after your booking is confirmed, typically 5\u20137 days before the experience date. This includes recommended clothing layers, personal essentials, and any experience-specific items you should carry.",
      },
    ],
  },
  {
    heading: "Weather, Conditions & Authority Controls",
    items: [
      {
        title: "What if weather affects the experience?",
        content:
          "Our leaders may alter timing, routes, or itineraries based on weather and ground conditions. Safety is the primary consideration. If significant changes are needed, we will communicate with you as early as possible and offer alternatives where feasible.",
      },
      {
        title: "What happens if an advertised feature is unavailable?",
        content:
          "Certain features such as specific viewpoints, water bodies, or natural phenomena may be inaccessible due to weather, seasonal conditions, or government restrictions. In such cases, we will offer the best available alternative. This does not constitute grounds for a full refund.",
      },
      {
        title: "Can experiences be cancelled due to government or authority orders?",
        content:
          "Yes, experiences may be cancelled or modified if local authorities close access to areas, impose curfews, or issue safety advisories. In such force majeure situations, we will offer rescheduling or credits as per our cancellation policy terms.",
      },
    ],
  },
  {
    heading: "Theme-Specific Clarifications",
    items: [
      {
        title: "Cycling & E-Biking",
        content:
          "Cycles and e-bikes are provided and maintained by Refuje. Participants must be comfortable riding a bicycle on mixed terrain. Helmets are mandatory. E-bike battery range varies by terrain and temperature; our leaders plan routes accordingly. Prior cycling experience is recommended for mountain routes.",
      },
      {
        title: "Hiking & Expeditions",
        content:
          "Hiking experiences range from easy day walks to multi-day high-altitude expeditions. Altitude, distance, and elevation gain are clearly listed for each experience. Participants should train appropriately for moderate and above difficulty levels. Our leaders carry first-aid kits and communication equipment on all hikes.",
      },
      {
        title: "Camping, Slow & Chill, and Solace Experiences",
        content:
          "Camping setups include quality tents, sleeping bags, and mats unless stated otherwise. Slow & Chill and Solace themes are designed for relaxation and minimal physical exertion. Facilities vary by location \u2014 some campsites have attached washrooms while others use shared or portable facilities.",
      },
      {
        title: "Stargazing & Night Photography",
        content:
          "Sky clarity is dependent on weather and atmospheric conditions and cannot be guaranteed. Where cloud cover prevents stargazing, we will pivot to an alternate session such as astrophotography tutorials, constellation storytelling, or a substitute activity. Telescopes and guidance are provided by Refuje.",
      },
      {
        title: "Wildlife Experiences",
        content:
          "Wildlife sightings are never guaranteed as animals are in their natural habitat. Our naturalists and local guides maximise your chances through expert tracking and knowledge of animal behaviour. All wildlife experiences adhere strictly to national park rules and ethical wildlife viewing practices.",
      },
      {
        title: "Culture, Local Life & Culinary Experiences",
        content:
          "Cultural and culinary experiences involve interaction with local communities, artisans, and home cooks. Dietary restrictions and allergies must be communicated at the time of booking. Menus and cultural activities may vary based on seasonal availability and local customs.",
      },
      {
        title: "Riding & Driving Experiences",
        content:
          "Participants must hold a valid driving licence for the vehicle category being used. Refuje provides vehicles in roadworthy condition with all required permits. Fuel, tolls, and vehicle damage due to rider negligence are the participant\u2019s responsibility unless specified otherwise.",
      },
      {
        title: "Private & Custom Trips",
        content:
          "Private and custom trips are tailored to your group\u2019s preferences, schedule, and budget. A minimum group size or spend may apply. Custom itineraries require a lead time of at least 10\u201314 days. Final pricing is confirmed once all elements are locked in.",
      },
      {
        title: "Kids, Families & Pets",
        content:
          "Family-friendly experiences are clearly tagged on our website. Children must be accompanied by a parent or legal guardian at all times. Pet policies vary by location and experience type \u2014 please check the listing or contact us before bringing a pet. Not all stays and activities are pet-friendly.",
      },
      {
        title: "Photography, Drones & Content",
        content:
          "Personal photography is welcome on all experiences. Drones are only permitted where legally allowed and require prior written authorisation from Refuje. Refuje may photograph or film experiences for promotional purposes; participants can opt out at any time by informing the trip leader.",
      },
      {
        title: "On the Day",
        content:
          "Please arrive at the meeting point at the time specified in your confirmation email. Late arrivals may not be accommodated if the group has already departed. Carry a printed or digital copy of your booking confirmation, a valid photo ID, and any personal items from the packing list.",
      },
      {
        title: "International Guests",
        content:
          "International guests are welcome on all experiences. A valid passport and any required visa must be carried at all times. Some regions in India require special permits (e.g., Inner Line Permits) for foreign nationals \u2014 we will advise you during booking. Prices are listed in INR; currency conversion is handled by your bank.",
      },
    ],
  },
  {
    heading: "Policies & Contact",
    items: [
      {
        title: "Where can I read the full Terms & Conditions?",
        content:
          "Our complete Terms & Conditions are available at refuje.com/terms-and-conditions. By booking any experience, you agree to be bound by these terms. We recommend reading them before making a booking.",
      },
      {
        title: "Where is the full Cancellation Policy?",
        content:
          "The complete Cancellation & Refund Policy is available at refuje.com/cancellation-policy. It covers cancellation windows, refund timelines, credit issuance, and force majeure provisions for all experience types.",
      },
      {
        title: "Where is the Privacy Policy?",
        content:
          "Our Privacy Policy is available at refuje.com/privacy-policy. It details how we collect, use, and protect your personal information in compliance with applicable data protection laws.",
      },
      {
        title: "How do I contact Refuje?",
        content:
          "You can reach us by email at myrefuje@gmail.com, by phone or WhatsApp at +91-7807740707, or through the contact form on our website. Our team is available Monday to Sunday, 9:00 AM to 5:00 PM IST.",
      },
      {
        title: "I have a complaint or grievance. Who do I contact?",
        content:
          "For complaints or grievances, please email myrefuje@gmail.com with details of your concern. Our Grievance Officer will acknowledge your complaint within 48 hours and work toward a resolution. You may also refer to the Grievance Officer details in our Privacy Policy.",
      },
    ],
  },
];

export function FaqAccordions() {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[1px] mb-4">
            {section.heading}
          </h2>
          <AccordionSection items={section.items} />
        </div>
      ))}
    </div>
  );
}
