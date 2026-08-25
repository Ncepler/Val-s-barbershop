import { BarberDemo } from "@/components/demos/BarberDemo";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Val's Elegant Barbershop",
  url: "https://valselegant.com",
  telephone: "(516) 399-2220",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8 Main St",
    addressLocality: "Roslyn",
    addressRegion: "NY",
    postalCode: "11576",
    addressCountry: "US",
  },
  sameAs: ["https://share.google/UdcSv1yE5dZ348ZHF"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <BarberDemo />
    </>
  );
}
