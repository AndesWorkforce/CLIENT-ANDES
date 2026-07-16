export function amountRangeToParams(
  range: string,
): { montoMin?: number; montoMax?: number } {
  switch (range) {
    case "0-10000":
      return { montoMax: 10000 };
    case "10000-15000":
      return { montoMin: 10001, montoMax: 15000 };
    case "15000-20000":
      return { montoMin: 15001, montoMax: 20000 };
    case "20000+":
      return { montoMin: 20001 };
    default:
      return {};
  }
}
