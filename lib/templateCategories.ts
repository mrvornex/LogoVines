export interface TemplateCategory {
  slug:    string;
  label:   string;
  dbValue: string;
  icon:    string;
  color:   string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { slug: "animal",             label: "Animal",             dbValue: "Animal",             icon: "🐾", color: "#6fcf97" },
  { slug: "building",          label: "Building",           dbValue: "Building",           icon: "🏗",  color: "#f2994a" },
  { slug: "business",          label: "Business",           dbValue: "Business",           icon: "💼", color: "#6c9fff" },
  { slug: "food-drinks",       label: "Food & Drinks",      dbValue: "Food & Drinks",      icon: "🍔", color: "#eb5757" },
  { slug: "letter",            label: "Letter",             dbValue: "Letter",             icon: "🔤", color: "#a78bfa" },
  { slug: "sports",            label: "Sports",             dbValue: "Sports",             icon: "⚽", color: "#f27676" },
  { slug: "technology",        label: "Technology",         dbValue: "Technology",         icon: "💻", color: "#27ae60" },
  { slug: "travel-transport",  label: "Travel & Transport", dbValue: "Travel & Transport", icon: "✈️", color: "#e8c96a" },
  // { slug: "nature",            label: "Nature",             dbValue: "Nature",             icon: "🌿", color: "#6fcf97" },
  // { slug: "fashion-beauty",    label: "Fashion & Beauty",   dbValue: "Fashion & Beauty",   icon: "💄", color: "#e879a0" },
  // { slug: "education",         label: "Education",          dbValue: "Education",          icon: "🎓", color: "#56ccf2" },
  // { slug: "music-arts",        label: "Music & Arts",       dbValue: "Music & Arts",       icon: "🎵", color: "#c4854a" },
  // { slug: "health-medical",    label: "Health & Medical",   dbValue: "Health & Medical",   icon: "🏥", color: "#27ae60" },
  // { slug: "real-estate",       label: "Real Estate",        dbValue: "Real Estate",        icon: "🏠", color: "#56ccf2" },
  // { slug: "finance-crypto",    label: "Finance & Crypto",   dbValue: "Finance & Crypto",   icon: "💰", color: "#e8c96a" },
  // { slug: "gaming",            label: "Gaming",             dbValue: "Gaming",             icon: "🎮", color: "#a78bfa" },
];

export function templateCategoryToSlug(dbValue: string): string {
  const found = TEMPLATE_CATEGORIES.find((c) => c.dbValue.toLowerCase() === dbValue.toLowerCase());
  if (found) return found.slug;
  return dbValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function templateSlugToDbValue(slug: string): string {
  const found = TEMPLATE_CATEGORIES.find((c) => c.slug === slug);
  return found ? found.dbValue : slug;
}

export function templateSlugToLabel(slug: string): string {
  const found = TEMPLATE_CATEGORIES.find((c) => c.slug === slug);
  if (found) return found.label;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}