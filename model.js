export const CAPACITY = 160;
export const DEFAULTS = Object.freeze({ hours: 32, people: 3, monthlySalary: 4800, upkeep: 600 });
export const LIMITS = Object.freeze({ hours: CAPACITY, people: 100, monthlySalary: 50000, upkeep: 100000 });
export function normalize(values) {
  const out = {};
  for (const key of Object.keys(DEFAULTS)) {
    const value = Number(values[key]);
    out[key] = Number.isFinite(value) ? Math.min(LIMITS[key], Math.max(0, value)) : 0;
  }
  out.people = Math.max(1, Math.round(out.people));
  return out;
}
export function calculate(values) {
  const inputs = normalize(values);
  const monthlyHours = inputs.hours * inputs.people;
  const timeCost = monthlyHours * inputs.monthlySalary / CAPACITY;
  const monthly = timeCost + inputs.upkeep;
  return { inputs, timeCost, monthly, annual: monthly * 12, monthlyHours,
    annualHours: monthlyHours * 12, capacityShare: inputs.hours / CAPACITY * 100,
    shares: monthly ? [timeCost / monthly * 100, inputs.upkeep / monthly * 100] : [0, 0] };
}
