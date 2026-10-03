import { featuresData } from "../data/mockData";

export const onboardingSlides = [
  {
    id: "welcome",
    screenType: "hero",
    badge: "স্বাগতম",
    title: "বহুনির্বাচনি বা সৃজনশীল—পরীক্ষা দাও পরীক্ষালয়ে",
    description: "বাংলাদেশের নাম্বার ০১ এক্সাম প্রিপারেশন অ্যাপে তোমাকে স্বাগতম।",
  },
  ...featuresData.slice(0, 4),
];