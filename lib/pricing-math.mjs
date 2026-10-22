/**
 * Pure pricing arithmetic. Callers must supply validated, owner-approved costs.
 * No costs, rates, or margins are stored in this module or exposed by public APIs.
 */
const finiteNonNegative = (name, value) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} must be a finite, non-negative number`);
  }
  return value;
};

const pct = (name, value, max = 100) => {
  finiteNonNegative(name, value);
  if (value > max) throw new RangeError(`${name} must not exceed ${max}%`);
  return value / 100;
};

const roundMoney = (amount) => Math.ceil((amount - Number.EPSILON) * 100) / 100;

/**
 * Processing fees are a percentage of the selling price, so the minimum quote
 * is grossed up algebraically: base delivery cost / (1 - gross margin - fee rate).
 * This is equivalent to total delivery cost / (1 - target gross margin) when
 * delivery cost includes the processing fee calculated on that quote.
 */
export function calculateMinimumQuote(input) {
  if (!input || typeof input !== "object") throw new TypeError("Pricing inputs are required");
  const labourHours = finiteNonNegative("labourHours", input.labourHours);
  const hourlyRate = finiteNonNegative("hourlyRate", input.hourlyRate);
  const contractorCost = finiteNonNegative("contractorCost", input.contractorCost);
  const softwareApiCost = finiteNonNegative("softwareApiCost", input.softwareApiCost);
  const otherDirectCosts = finiteNonNegative("otherDirectCosts", input.otherDirectCosts);
  const fixedPaymentFee = finiteNonNegative("fixedPaymentFee", input.fixedPaymentFee);
  const reworkRate = pct("reworkAllowancePct", input.reworkAllowancePct, 500);
  const paymentRate = pct("paymentFeeRatePct", input.paymentFeeRatePct, 100);
  const marginRate = pct("targetGrossMarginPct", input.targetGrossMarginPct, 99.99);
  const proposedSellingPrice = input.proposedSellingPrice === undefined
    ? 0
    : finiteNonNegative("proposedSellingPrice", input.proposedSellingPrice);

  if (marginRate + paymentRate >= 1) {
    throw new RangeError("Target gross margin plus payment fee rate must be below 100%");
  }

  const labourCost = labourHours * hourlyRate;
  const baseDirectCost = labourCost + contractorCost + softwareApiCost + otherDirectCosts;
  const reworkAllowance = baseDirectCost * reworkRate;
  const deliveryCostBeforePercentageFee = baseDirectCost + reworkAllowance + fixedPaymentFee;
  const minimumQuote = roundMoney(deliveryCostBeforePercentageFee / (1 - marginRate - paymentRate));
  const recommendedSellingPrice = roundMoney(Math.max(minimumQuote, proposedSellingPrice));
  const paymentProcessingCost = recommendedSellingPrice * paymentRate + fixedPaymentFee;
  const totalDeliveryCost = baseDirectCost + reworkAllowance + paymentProcessingCost;
  const contribution = recommendedSellingPrice - totalDeliveryCost;

  return {
    labourCost: roundMoney(labourCost),
    baseDirectCost: roundMoney(baseDirectCost),
    reworkAllowance: roundMoney(reworkAllowance),
    deliveryCostBeforePercentageFee: roundMoney(deliveryCostBeforePercentageFee),
    minimumQuote,
    recommendedSellingPrice,
    paymentProcessingCost: roundMoney(paymentProcessingCost),
    totalDeliveryCost: roundMoney(totalDeliveryCost),
    contribution: roundMoney(contribution),
    contributionMarginPct: recommendedSellingPrice > 0
      ? Math.round((contribution / recommendedSellingPrice) * 10000) / 100
      : 0,
    targetGrossMarginPct: input.targetGrossMarginPct,
  };
}
