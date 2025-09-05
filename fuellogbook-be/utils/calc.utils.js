// Litres filled = Amount ÷ Price per litre
export function calcLitres(amount, pricePerL) {
  if (!pricePerL || pricePerL <= 0) return 0;
  return parseFloat((amount / pricePerL).toFixed(3)); // 3 decimals
}

// Mileage = Distance ÷ Litres
export function calcMileage(distance, litres) {
  if (!distance || !litres || litres <= 0) return 0;
  return parseFloat((distance / litres).toFixed(2)); // 2 decimals
}

// Running cost = Amount ÷ Distance
export function calcRunningCost(amount, distance) {
  if (!distance || distance <= 0) return 0;
  return parseFloat((amount / distance).toFixed(2)); // 2 decimals
}