function toBanglaNumeral(number) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
}
export default toBanglaNumeral;
