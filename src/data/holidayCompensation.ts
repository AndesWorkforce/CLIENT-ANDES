// Holiday compensation multipliers by country
export const HOLIDAY_MULTIPLIERS: Record<string, string> = {
  Venezuela: "double",
  Argentina: "double",
  Honduras: "double",
  "Dominican Republic": "double",
  Mexico: "triple",
  Chile: "1.5",
  Australia: "2.5",
  Panama: "2.5",
  Philippines: "double",
  Colombia: "double",
};

export const getHolidayCompensationMessage = (country: string): string => {
  const multiplier = HOLIDAY_MULTIPLIERS[country];
  if (!multiplier) return "";
  return `Work performed on public holidays shall be compensated in accordance with applicable labor laws. In ${country}, such work shall be paid at ${multiplier} the ordinary rate.`;
};
