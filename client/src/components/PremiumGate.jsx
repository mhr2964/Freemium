export default function PremiumGate({ isPremium, onUpgrade, children }) {
  if (isPremium) {
    return children;
  }

  return (
    <section className="premium-cta">
      <p className="eyebrow">Premium</p>
      <h2>Unlock the paid experience</h2>
      <p>Upgrade to access premium-only content in your dashboard.</p>
      <button type="button" onClick={onUpgrade}>
        Upgrade to Premium
      </button>
    </section>
  );
}
