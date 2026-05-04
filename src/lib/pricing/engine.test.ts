import { describe, it, expect } from 'vitest';
import { calculateLineItemPricing } from './engine';

describe('Brite 2.0 Pricing Engine', () => {
    it('should calculate the base cost correctly for a standard window', () => {
        const result = calculateLineItemPricing({
            width: 20,
            height: 20,
            productType: 'CASEMENT',
            glassType: 'DOUBLE',
            options: [],
            markupPercentage: 20
        });

        // Cost: (20*20) * 0.5 = 200
        // Price (20% markup): 200 * 1.2 = 240
        // Margin: 240 - 200 = 40
        // Margin Percentage: (40 / 240) * 100 = 16.67%
        expect(result.unitCost.toNumber()).toBe(200);
        expect(result.unitPrice.toNumber()).toBe(240);
        expect(result.marginAmount.toNumber()).toBe(40);
        expect(result.marginPercentage.toNumber()).toBeCloseTo(16.67);
    });

    it('should apply the extra cost of Trimax technology', () => {
        const result = calculateLineItemPricing({
            width: 10,
            height: 10,
            productType: 'CASEMENT',
            glassType: 'TRIMAX', // Multiplier 1.4
            options: [],
            markupPercentage: 15
        });

        // Cost: (10*10) * 0.5 * 1.4 = 70
        // Price (20% markup): 70 * 1.15 = 80.5
        // Margin: 80.5 - 70 = 10.5
        // Margin Percentage: (10.5 / 80.5) * 100 = 13.04%
        expect(result.unitCost.toNumber()).toBe(70);
        expect(result.unitPrice.toNumber()).toBe(80.5);
        expect(result.marginAmount.toNumber()).toBe(10.5);
        expect(result.marginPercentage.toNumber()).toBeCloseTo(13.04);
    });
});