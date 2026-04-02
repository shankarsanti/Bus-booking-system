export const calculatePrice = (
  basePrice: number,
  seatType: 'seater' | 'sleeper',
  distance: number
): number => {
  const typeMultiplier = seatType === 'sleeper' ? 1.5 : 1;
  const distanceMultiplier = distance / 100;
  return Math.round(basePrice * typeMultiplier * distanceMultiplier);
};

export const applyDiscount = (price: number, discountPercent: number): number => {
  return Math.round(price * (1 - discountPercent / 100));
};

export const calculateTotalPrice = (prices: number[]): number => {
  return prices.reduce((sum, price) => sum + price, 0);
};
