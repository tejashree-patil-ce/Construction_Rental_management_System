const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const calculateBill = ({ startDate, endDate, quantity, dailyRate }) => {
  const elapsedMs = Math.max(0, new Date(endDate) - new Date(startDate));
  const elapsedDays = elapsedMs / MS_PER_DAY;

  // Any started day counts as a full day, and the minimum is 1 day
  const billedDays = Math.max(1, Math.ceil(elapsedDays));

  const totalAmount = Math.round(quantity * dailyRate * billedDays * 100) / 100;

  return {
    elapsedDays: Number(elapsedDays.toFixed(5)),
    billedDays,
    totalAmount,
  };
};