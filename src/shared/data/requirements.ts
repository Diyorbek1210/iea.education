export interface CountryRequirement {
  country: string;
  flag: string;
  purpose: string;
  overallBand: number;
  minPerSkill: number;
  notes: string;
}

export interface UniversityRequirement {
  university: string;
  country: string;
  program: string;
  overallBand: number;
  minWriting: number;
  minSpeaking: number;
  url: string;
}

export const COUNTRY_REQUIREMENTS: CountryRequirement[] = [
  // UK
  { country: "United Kingdom", flag: "🇬🇧", purpose: "Student Visa (Tier 4)", overallBand: 5.5, minPerSkill: 5.0, notes: "Most universities require 6.0–7.0. Russell Group universities typically need 6.5+" },
  { country: "United Kingdom", flag: "🇬🇧", purpose: "Skilled Worker Visa", overallBand: 4.0, minPerSkill: 4.0, notes: "CEFR Level A1 minimum. Higher roles may need B1 (4.0) or B2 (5.5)" },
  { country: "United Kingdom", flag: "🇬🇧", purpose: "Settlement (Indefinite Leave)", overallBand: 4.0, minPerSkill: 4.0, notes: "CEFR A1 for settlement. Some professions require higher" },
  // Australia
  { country: "Australia", flag: "🇦🇺", purpose: "Student Visa (Subclass 500)", overallBand: 5.5, minPerSkill: 5.0, notes: "Universities typically require 6.0–7.0. Some programs need 7.0+" },
  { country: "Australia", flag: "🇦🇺", purpose: "Skilled Migration (General)", overallBand: 6.0, minPerSkill: 6.0, notes: "Required for most skilled visa subclasses (189, 190, 491)" },
  { country: "Australia", flag: "🇦🇺", purpose: "Professional Registration", overallBand: 7.0, minPerSkill: 7.0, notes: "Required for medical, nursing, teaching professions" },
  // Canada
  { country: "Canada", flag: "🇨🇦", purpose: "Study Permit", overallBand: 6.0, minPerSkill: 5.5, notes: "College diploma programs may accept 5.5. Universities need 6.5+" },
  { country: "Canada", flag: "🇨🇦", purpose: "Express Entry (Federal Skilled Worker)", overallBand: 7.0, minPerSkill: 7.0, notes: "CLB 7 minimum. CLB 9 gives significant CRS points" },
  { country: "Canada", flag: "🇨🇦", purpose: "Provincial Nominee Program", overallBand: 5.0, minPerSkill: 4.5, notes: "Varies by province. Some require CLB 4–5" },
  // New Zealand
  { country: "New Zealand", flag: "🇳🇿", purpose: "Student Visa", overallBand: 5.5, minPerSkill: 5.0, notes: "Some institutions accept 5.0. Universities need 6.0+" },
  { country: "New Zealand", flag: "🇳🇿", purpose: "Skilled Migrant Visa", overallBand: 6.5, minPerSkill: 6.5, notes: "Required for most skilled visa categories" },
  // USA
  { country: "United States", flag: "🇺🇸", purpose: "University Admission", overallBand: 6.5, minPerSkill: 6.0, notes: "Top universities may require 7.0+. Some accept TOEFL instead" },
  { country: "United States", flag: "🇺🇸", purpose: "Immigration (Visa)", overallBand: 5.0, minPerSkill: 4.5, notes: "USCIS accepts IELTS for certain visa categories" },
  // Ireland
  { country: "Ireland", flag: "🇮🇪", purpose: "Student Visa", overallBand: 5.5, minPerSkill: 5.0, notes: "Universities typically require 6.0–6.5" },
  { country: "Ireland", flag: "🇮🇪", purpose: "Critical Skills Permit", overallBand: 6.5, minPerSkill: 6.0, notes: "Required for occupation on Critical Skills list" },
  // Germany
  { country: "Germany", flag: "🇩🇪", purpose: "University Admission", overallBand: 6.0, minPerSkill: 5.5, notes: "Many programs taught in English. Some require TestDaF instead" },
  // South Africa
  { country: "South Africa", flag: "🇿🇦", purpose: "University Admission", overallBand: 6.0, minPerSkill: 5.5, notes: "Some universities require 6.5 for postgraduate" },
  // Dubai/UAE
  { country: "UAE (Dubai)", flag: "🇦🇪", purpose: "University Admission", overallBand: 5.0, minPerSkill: 5.0, notes: "Some universities accept 4.5 for pathway programs" },
  // Singapore
  { country: "Singapore", flag: "🇸🇬", purpose: "University Admission", overallBand: 6.5, minPerSkill: 6.0, notes: "NUS and NTU typically require 6.5+" },
];

export const POPULAR_UNIVERSITIES: UniversityRequirement[] = [
  { university: "University of Oxford", country: "UK", program: "All Programs", overallBand: 7.0, minWriting: 7.0, minSpeaking: 6.5, url: "https://www.ox.ac.uk/admissions/graduate/international-students/english-language-requirements/" },
  { university: "University of Cambridge", country: "UK", program: "All Programs", overallBand: 7.0, minWriting: 7.0, minSpeaking: 6.5, url: "https://www.graduatestudy.cam.ac.uk/english-language" },
  { university: "Imperial College London", country: "UK", program: "All Programs", overallBand: 7.0, minWriting: 6.5, minSpeaking: 6.5, url: "https://www.imperial.ac.uk/study/admissions/graduate/learn/english-language-requirements/" },
  { university: "UCL", country: "UK", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://www.ucl.ac.uk/english-language/requirements" },
  { university: "University of Edinburgh", country: "UK", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/view&edition=2024&id=105" },
  { university: "University of Melbourne", country: "Australia", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://study.unimelb.edu.au/find/courses/graduate/english-language-requirements/" },
  { university: "University of Sydney", country: "Australia", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://www.sydney.edu.au/courses/courses/pc/master-of-professional-engineering5758.html" },
  { university: "University of Toronto", country: "Canada", program: "Graduate", overallBand: 7.0, minWriting: 7.0, minSpeaking: 7.0, url: "https://www.sgs.utoronto.ca/about/join-us/admissions-requirements/english-language-proficiency-testing/" },
  { university: "McGill University", country: "Canada", program: "All Programs", overallBand: 6.5, minWriting: 6.5, minSpeaking: 6.5, url: "https://www.mcgill.ca/gradapplicants/international/english" },
  { university: "University of British Columbia", country: "Canada", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://you.ubc.ca/financial-costs/english-language-requirements/" },
  { university: "University of Auckland", country: "New Zealand", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://www.auckland.ac.nz/study/international-students/english-language-requirements/" },
  { university: "University of Dublin (Trinity)", country: "Ireland", program: "All Programs", overallBand: 6.5, minWriting: 6.0, minSpeaking: 6.0, url: "https://www.tcd.ie/study/postgraduate-postgraduate/how-to-apply/english-language-requirements/" },
  { university: "MIT", country: "USA", program: "Graduate", overallBand: 7.0, minWriting: 7.0, minSpeaking: 7.0, url: "https://gradadmissions.mit.edu/english-proficiency" },
  { university: "University of Manchester", country: "UK", program: "All Programs", overallBand: 6.5, minWriting: 6.5, minSpeaking: 6.5, url: "https://www.manchester.ac.uk/study/english-language-requirements/" },
  { university: "University of Glasgow", country: "UK", program: "All Programs", overallBand: 6.5, minWriting: 6.5, minSpeaking: 6.0, url: "https://www.gla.ac.uk/international/english/" },
];

export function getRequirementsByCountry(country: string): CountryRequirement[] {
  return COUNTRY_REQUIREMENTS.filter((r) => r.country === country);
}

export function getUniversitiesByCountry(country: string): UniversityRequirement[] {
  return POPULAR_UNIVERSITIES.filter((u) => u.country === country);
}
