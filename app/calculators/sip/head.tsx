export default function Head() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SIP Calculator | Finverse",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    url: "https://weneed.money/calculators/sip",
    description:
      "Plan your mutual fund SIP with inflation and step-up options using Finverse's AI-powered calculator.",
  };

  return (
    <>
      <title>SIP Calculator | Plan mutual fund SIPs with inflation | Finverse</title>
      <meta
        name="description"
        content="Calculate SIP maturity, returns, and inflation-adjusted value with step-up options on Finverse."
      />
      <meta
        name="keywords"
        content="sip calculator, mutual fund sip, step-up sip, inflation adjusted returns, wealth calculator"
      />
      <link rel="canonical" href="https://weneed.money/calculators/sip" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </>
  );
}
