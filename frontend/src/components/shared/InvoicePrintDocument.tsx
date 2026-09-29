import { reservationService } from '@/services/reservationService';
import { reservationSourceLabels } from '@/constants/reservationStatuses';
import type { Invoice } from '@/types/auth.types';

interface InvoicePrintDocumentProps {
  invoice: Invoice;
}

function formatIDR(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

/**
 * Print-only A4 invoice document. Rendered inside `.invoice-print-area`
 * (hidden on screen, visible in print via invoice-print.css).
 * Uses actual invoice + linked reservation data only — no invented values.
 * Taxes/service charges have no source field in the Invoice model, so they
 * are intentionally omitted rather than fabricated.
 */
export function InvoicePrintDocument({ invoice }: InvoicePrintDocumentProps) {
  const reservation = invoice.reservationId ? reservationService.getById(invoice.reservationId) : undefined;
  const rooms = invoice.reservationId ? reservationService.getRoomsByReservationId(invoice.reservationId) : [];
  const generatedAt = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="invoice-print">
      <header className="invoice-print__header">
        <div>
          <div className="invoice-print__brand">Joglo Seruni</div>
          <div className="invoice-print__sub">Hotel Property Management System</div>
        </div>
        <div className="invoice-print__titleblock">
          <div className="invoice-print__title">INVOICE</div>
          <div className="invoice-print__number">{invoice.invoiceNumber}</div>
        </div>
      </header>

      <section className="invoice-print__meta">
        <div className="invoice-print__metacol">
          <div className="invoice-print__label">Billed To</div>
          <div className="invoice-print__value">{invoice.guestName}</div>
          <div className="invoice-print__muted">{reservationSourceLabels[invoice.source] || invoice.source}</div>
        </div>
        <div className="invoice-print__metacol invoice-print__metacol--right">
          <div className="invoice-print__row">
            <span className="invoice-print__label">Invoice Date</span>
            <span className="invoice-print__value">{invoice.invoiceDate}</span>
          </div>

          <div className="invoice-print__row">
            <span className="invoice-print__label">Reservation</span>
            <span className="invoice-print__value">{reservation ? reservation.reservationCode : (invoice.reservationId || '—')}</span>
          </div>
          <div className="invoice-print__row">
            <span className="invoice-print__label">Payment Status</span>
            <span className="invoice-print__value">{invoice.paymentStatus}</span>
          </div>
          <div className="invoice-print__row">
            <span className="invoice-print__label">Invoice Status</span>
            <span className="invoice-print__value">{invoice.invoiceStatus}</span>
          </div>
        </div>
      </section>

      {reservation && (
        <section className="invoice-print__section">
          <div className="invoice-print__sectiontitle">Reservation &amp; Room Information</div>
          <div className="invoice-print__muted">
            {reservation.reservationCode} · {reservation.guestName} · {reservation.checkInDate} → {reservation.checkOutDate}
            {rooms.length > 0 && (
              <> · {rooms.map((r) => `Room ${r.roomNumber} (${r.roomTypeName})`).join(', ')}</>
            )}
          </div>
        </section>
      )}

      <section className="invoice-print__section">
        <div className="invoice-print__sectiontitle">Invoice Items</div>
        <table className="invoice-print__table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Description</th>
              <th style={{ textAlign: 'right', width: '70px' }}>Qty</th>
              <th style={{ textAlign: 'right', width: '130px' }}>Unit Price</th>
              <th style={{ textAlign: 'right', width: '130px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatIDR(item.unitPrice)}</td>
                <td style={{ textAlign: 'right' }}>{formatIDR(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="invoice-print__totals">
        <div className="invoice-print__row">
          <span className="invoice-print__label">Subtotal</span>
          <span className="invoice-print__value">{formatIDR(invoice.subtotal)}</span>
        </div>
        <div className="invoice-print__row">
          <span className="invoice-print__label">Discount</span>
          <span className="invoice-print__value">{formatIDR(invoice.discount)}</span>
        </div>
        <div className="invoice-print__row invoice-print__row--total">
          <span className="invoice-print__label">Total</span>
          <span className="invoice-print__value">{formatIDR(invoice.total)}</span>
        </div>
      </section>

      {reservation?.notes && reservation.notes.trim() && (
        <section className="invoice-print__section">
          <div className="invoice-print__sectiontitle">Notes</div>
          <div className="invoice-print__muted" style={{ whiteSpace: 'pre-wrap' }}>{reservation.notes}</div>
        </section>
      )}

      <footer className="invoice-print__footer">
        <div>Generated on {generatedAt} · Joglo Seruni</div>
        <div>Thank you for staying with us.</div>
      </footer>
    </div>
  );
}
