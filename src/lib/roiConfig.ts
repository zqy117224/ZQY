export const ROI_CONFIG = {
  // 7% real annualized S&P 500 return (1928-2024, with dividends reinvested).
  // Source-year salaries are held constant in real terms after the modelled
  // transition to the occupation median.
  opportunityCostRate: 0.07,

  // Conservative real (inflation-adjusted) tuition escalation assumption.
  // For context, Studymove (2025) reported nominal Australian international
  // student fees rising ~5.2% in 2024-25 (2018-2025 sector average ~5.1%/yr).
  tuitionEscalationRate: 0.02,

  // Conservative real (inflation-adjusted) living-cost escalation assumption.
  // For context, nominal Australian CPI has run ~2.5-3% with ABS September
  // 2025 rent inflation around 3.7%.
  livingCostEscalationRate: 0.005,

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
