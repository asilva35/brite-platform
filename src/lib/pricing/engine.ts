import { Decimal } from 'decimal.js';
import { BASE_RATES, GLASS_MULTIPLIERS, OPTION_COSTS } from './constants';

export interface PricingInput {
    width: number;
    height: number;
    productType: keyof typeof BASE_RATES;
    glassType: keyof typeof GLASS_MULTIPLIERS;
    options: (keyof typeof OPTION_COSTS)[];
    markupPercentage: number; // Defined by the Sales Rep or Admin
}

export interface PricingResult {
    unitCost: Decimal;
    unitPrice: Decimal;
    marginAmount: Decimal;
    marginPercentage: Decimal;
}

export function calculateLineItemPricing(input: PricingInput): PricingResult {
    const area = new Decimal(input.width).mul(input.height);

    // 1. Calculate Base Manufacturing Cost
    let cost = area.mul(BASE_RATES[input.productType]);

    // 2. Apply Glass multiplier
    cost = cost.mul(GLASS_MULTIPLIERS[input.glassType]);

    // 3. Add accessories
    input.options.forEach(opt => {
        cost = cost.plus(OPTION_COSTS[opt]);
    });

    // 4. Calculate Sale Price based on Markup
    // Price = Cost * (1 + Markup)
    const markup = new Decimal(input.markupPercentage).div(100);
    const price = cost.mul(markup.plus(1));

    const marginAmount = price.minus(cost);
    const marginPercentage = marginAmount.div(price).mul(100);

    return {
        unitCost: cost.toDecimalPlaces(2),
        unitPrice: price.toDecimalPlaces(2),
        marginAmount: marginAmount.toDecimalPlaces(2),
        marginPercentage: marginPercentage.toDecimalPlaces(2),
    };
}