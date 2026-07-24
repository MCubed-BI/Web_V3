export default function InvoiceAging() {
  return (
    <div>
      <div className="page-header">
        <h1>Invoice Aging</h1>
      </div>
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h2>Aging Data Coming Soon</h2>
        <p>Connect DDI aging tables to view invoice aging buckets (Current, 30, 60, 90+ days).</p>
      </div>
    </div>
  );
}