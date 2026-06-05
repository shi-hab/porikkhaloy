function replaceNumberWithBanglaLetter(number) {
       
	const banglaLetters = [
	  "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ",
	  "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন",
	  "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ",
	  "স", "হ", "ড়", "ঢ়", "য়", "ৎ", "অ", "আ", "ই", "ঈ",
	];
  
	
	if (number < 1 || number > banglaLetters.length) {
	  return "Invalid number"; 
	}
	return banglaLetters[number - 1];
  }


  export default replaceNumberWithBanglaLetter;