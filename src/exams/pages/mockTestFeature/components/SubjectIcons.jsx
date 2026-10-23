import {
  Atom, BarChart3, BookMarked, BookOpen, Brain, Briefcase, Cpu, Dna, FlaskConical, Home,
  Landmark, Languages, Lightbulb, Map, Microscope, Puzzle, Sigma, Sprout, TrendingUp,
} from "lucide-react";

/** Soft tint + ink colour pairs for the icon badge. */
const TONES = {
  green: "bg-[#E3F6EC] text-[#14804A]",
  orange: "bg-[#FFEFDB] text-[#C2650A]",
  blue: "bg-[#E6ECFF] text-[#3558E8]",
  violet: "bg-[#F0E9FF] text-[#6D3FD1]",
  rose: "bg-[#FFE7EC] text-[#D12E55]",
  teal: "bg-[#DDF4F5] text-[#0B7E86]",
  amber: "bg-[#FFF4CC] text-[#8A6100]",
};

// Order matters: specific subjects first, the generic "বিজ্ঞান" last.
const RULES = [
  [/জীব|bio/i, Dna, "green"],
  [/রসায়ন|chem/i, FlaskConical, "orange"],
  [/পদার্থ|phys/i, Atom, "blue"],
  [/english|ইংরেজি|ইংলিশ/i, Languages, "violet"],
  [/সাধারণ\s*জ্ঞান|\bgk\b|general/i, Lightbulb, "teal"],
  [/গণিত|math/i, Sigma, "blue"],
  [/বাংলা|bangla/i, BookOpen, "rose"],
  [/কৃষি|agri/i, Sprout, "green"],
  [/পরিসংখ্যান|statistic/i, BarChart3, "teal"],
  [/তথ্য|\bict\b|কম্পিউটার|computer/i, Cpu, "teal"],
  [/মনোবিজ্ঞান|psych/i, Brain, "violet"],
  [/মানসিক|mental|aptitude/i, Puzzle, "violet"],
  [/গার্হস্থ্য|home\s*sci/i, Home, "rose"],
  [/\biba\b|ব্যবসা|business|হিসাব|account/i, Briefcase, "amber"],
  [/ইতিহাস|history/i, Landmark, "amber"],
  [/ভূগোল|geograph/i, Map, "green"],
  [/অর্থনীতি|econom/i, TrendingUp, "amber"],
  [/ধর্ম|ইসলাম|islam/i, BookMarked, "teal"],
  [/বিজ্ঞান|science/i, Microscope, "blue"],
];

export function getSubjectIcon(title = "") {
  for (const [re, Icon, tone] of RULES) {
    if (re.test(title)) return { Icon, tone: TONES[tone] };
  }
  return { Icon: BookOpen, tone: TONES.blue };
}