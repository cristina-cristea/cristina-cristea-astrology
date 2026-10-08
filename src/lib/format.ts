export const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const orderRef = () =>
  "CC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
