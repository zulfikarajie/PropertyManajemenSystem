import pricingSeed from '../data/mock/reservationPricing.json';
import type {
  ReservationPricingPersisted,
  ReservationPricingState,
} from '@/types/pricing.types';
import { calculatePricing, enumerateNights } from '@/utils/pricingUtils';

interface PricingSeedRow extends ReservationPricingPersisted {
  reservationId: string;
}

/**
 * Frontend-only mock store for dynamic reservation pricing.
 *
 * - Separated from components (mock state lives here, not in UI).
 * - Structured for future Laravel API integration: use `toApiPayload`
 *   as the request body and `fromApiPayload` when the backend exists.
 * - Derived totals (roomTotal / dpAmount / remaining) are NEVER stored;
 *   they are always computed via `getCalculation`.
 */
class ReservationPricingService {
  private store = new Map<string, ReservationPricingPersisted>();

  constructor() {
    for (const row of pricingSeed as PricingSeedRow[]) {
      const { reservationId, ...persisted } = row;
      this.store.set(reservationId, { ...persisted });
    }
  }

  get(reservationId: string): ReservationPricingPersisted | undefined {
    const found = this.store.get(reservationId);
    return found ? { ...found, nightlyRates: found.nightlyRates.map((n) => ({ ...n })) } : undefined;
  }

  /** Editable UI state (adds sameRate derived from nightly rates for Same mode). */
  getState(
    reservationId: string,
    fallback: { checkInDate: string; checkOutDate: string; referenceRate: number; rateSource: string },
  ): ReservationPricingState {
    const persisted = this.get(reservationId);
    if (persisted) {
      return {
        mode: persisted.mode,
        sameRate: persisted.nightlyRates.length > 0 ? persisted.nightlyRates[0].rate : 0,
        nightlyRates: persisted.nightlyRates.map((n) => ({ ...n })),
        paymentType: persisted.paymentType,
        dpType: persisted.dpType,
        dpPercentage: persisted.dpPercentage ?? 30,
        dpFixedAmount: persisted.dpFixedAmount ?? 0,
      };
    }
    // Backward compatibility: reservations created before pricing existed.
    const dates = enumerateNights(fallback.checkInDate, fallback.checkOutDate);
    const perNight =
      dates.length > 0 && fallback.referenceRate > 0 ? Math.round(fallback.referenceRate) : 0;
    return {
      mode: 'same',
      sameRate: perNight,
      nightlyRates: dates.map((date) => ({ date, rate: perNight })),
      paymentType: 'no_dp',
      dpType: 'percentage',
      dpPercentage: 30,
      dpFixedAmount: 0,
    };
  }

  save(reservationId: string, state: ReservationPricingState, rateSource: string): ReservationPricingPersisted {
    const persisted: ReservationPricingPersisted = {
      rateSource,
      mode: state.mode,
      nightlyRates: state.nightlyRates.map((n) => ({ date: n.date, rate: Math.round(n.rate) })),
      paymentType: state.paymentType,
      dpType: state.dpType,
      ...(state.dpType === 'percentage'
        ? { dpPercentage: Number(state.dpPercentage) }
        : { dpFixedAmount: Math.round(Number(state.dpFixedAmount)) }),
    };
    this.store.set(reservationId, persisted);
    return { ...persisted };
  }

  remove(reservationId: string): void {
    this.store.delete(reservationId);
  }

  getCalculation(reservationId: string) {
    const persisted = this.get(reservationId);
    if (!persisted) return null;
    return calculatePricing({
      mode: persisted.mode,
      sameRate: persisted.nightlyRates[0]?.rate ?? 0,
      nightlyRates: persisted.nightlyRates,
      paymentType: persisted.paymentType,
      dpType: persisted.dpType,
      dpPercentage: persisted.dpPercentage ?? 0,
      dpFixedAmount: persisted.dpFixedAmount ?? 0,
    });
  }

  getRoomTotal(reservationId: string): number | null {
    return this.getCalculation(reservationId)?.roomTotal ?? null;
  }

  /**
   * Future Laravel API payload (conceptual):
   * POST /api/reservations/:id/pricing { rateSource, pricing: {mode, nightlyRates}, payment: {...} }
   */
  toApiPayload(rateSource: string, state: ReservationPricingState) {
    return {
      rateSource,
      pricing: {
        mode: state.mode,
        nightlyRates: state.nightlyRates.map((n) => ({ date: n.date, rate: Math.round(n.rate) })),
      },
      payment:
        state.paymentType === 'no_dp'
          ? { type: 'no_dp' as const }
          : state.dpType === 'percentage'
            ? { type: 'dp' as const, dpType: 'percentage' as const, dpPercentage: Number(state.dpPercentage) }
            : { type: 'dp' as const, dpType: 'fixed' as const, dpFixedAmount: Math.round(Number(state.dpFixedAmount)) },
    };
  }

  fromApiPayload(payload: ReturnType<ReservationPricingService['toApiPayload']>): ReservationPricingState {
    return {
      mode: payload.pricing.mode,
      sameRate: payload.pricing.nightlyRates[0]?.rate ?? 0,
      nightlyRates: payload.pricing.nightlyRates.map((n) => ({ ...n })),
      paymentType: payload.payment.type === 'dp' ? 'dp' : 'no_dp',
      dpType: payload.payment.type === 'dp' ? payload.payment.dpType : 'percentage',
      dpPercentage:
        payload.payment.type === 'dp' && payload.payment.dpType === 'percentage'
          ? payload.payment.dpPercentage
          : 30,
      dpFixedAmount:
        payload.payment.type === 'dp' && payload.payment.dpType === 'fixed' ? payload.payment.dpFixedAmount : 0,
    };
  }
}

export const reservationPricingService = new ReservationPricingService();
export default reservationPricingService;
