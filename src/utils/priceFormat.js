export function formatNumberWithCommas(num) {
  if (!num) return;
  const numStr = parseFloat(num).toFixed(2);
  const [integerPart, decimalPart] = numStr.split(".");
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formattedOtherNumbers = otherNumbers.replace(
    /\B(?=(\d{2})+(?!\d))/g,
    ","
  );
  return otherNumbers
    ? formattedOtherNumbers + "," + lastThree + "." + decimalPart
    : lastThree + "." + decimalPart;
}
