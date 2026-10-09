const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Display-only bill that keeps ticking between server fetches.
// The server still calculates the real, final bill when a rental is returned.
export const liveBill = ({ baseElapsedDays, fetchedAt, now, quantity, dailyRate }) => {
  const msSinceFetch = Math.max(0, now - (fetchedAt ?? now));
  const elapsedDays = baseElapsedDays + msSinceFetch / MS_PER_DAY;

  const billedDays = Math.max(1, Math.ceil(elapsedDays));
  const totalAmount = Math.round(quantity * dailyRate * billedDays * 100) / 100;

  return { elapsedDays, billedDays, totalAmount };
};