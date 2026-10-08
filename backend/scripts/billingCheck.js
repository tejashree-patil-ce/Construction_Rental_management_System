import { calculateBill } from "../utils/billing.js";

const start = new Date("2026-10-01T00:00:00Z");
const after = (days) => new Date(start.getTime() + days * 86400000);

console.log(calculateBill({ startDate: start, endDate: after(2.4), quantity: 50, dailyRate: 2 }));
console.log(calculateBill({ startDate: start, endDate: after(3), quantity: 50, dailyRate: 2 }));
console.log(calculateBill({ startDate: start, endDate: after(0.1), quantity: 50, dailyRate: 2 }));