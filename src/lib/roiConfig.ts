export const ROI_CONFIG = {
  // 7% real annualized S&P 500 return (1928-2024, with dividends reinvested).
  // A real rate is used to match the nominal wage data framework where recent
  // real Australian graduate wage growth is approximately 0%.
  opportunityCostRate: 0.07,

  // Studymove (2025): Australian international student fees rose 5.2% in
  // 2024-25, with the 2018-2025 sector average around 5.1% per year.
  tuitionEscalationRate: 0.05,

  // Reflects sustained Australian CPI around 2.5-3% plus a Melbourne rental
  // market premium, including ABS September 2025 rent inflation around 3.7%.
  livingCostEscalationRate: 0.035,

  defaultLivingCost: 40_000,
  livingCostTiers: [
    {
      label: "Visa minimum (unrealistic for most students)",
      shortLabel: "Visa minimum",
      value: 29_710
    },
    {
      label: "Typical student lifestyle (shared housing, self-catering)",
      shortLabel: "Typical student lifestyle",
      value: 40_000
    },
    {
      label: "Comfortable (based on ASFA single renter benchmark)",
      shortLabel: "Comfortable",
      value: 45_000
    }
  ]
} as const;
