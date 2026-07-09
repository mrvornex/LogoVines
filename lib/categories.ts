export interface Category {
  slug:    string;
  label:   string;
  dbValue: string;
  icon:    string;
  color:   string;
}

export const CATEGORIES: Category[] = [
  { slug: "auto-moto",        label: "Auto & Moto",        dbValue: "Auto & Moto",        icon: "🚗", color: "#56ccf2" },
  { slug: "fashion",          label: "Fashion",            dbValue: "Fashion",            icon: "👗", color: "#e879a0" },
  { slug: "social-media",     label: "Social Media",       dbValue: "Social Media",       icon: "📱", color: "#6c9fff" },
  { slug: "technology",       label: "Technology",         dbValue: "Technology",         icon: "💻", color: "#a78bfa" },
  { slug: "food-drinks",      label: "Food & Drinks",      dbValue: "Food & Drinks",      icon: "🍔", color: "#f2994a" },
  { slug: "finance",          label: "Finance",            dbValue: "Finance",            icon: "💰", color: "#27ae60" },
  { slug: "sports",           label: "Sports",             dbValue: "Sports",             icon: "⚽", color: "#f27676" },
  { slug: "transport",        label: "Transport",          dbValue: "Transport",          icon: "✈️", color: "#e8c96a" },
  // { slug: "health-medical",   label: "Health & Medical",   dbValue: "Health & Medical",   icon: "🏥", color: "#6fcf97" },
  // { slug: "education",        label: "Education",          dbValue: "Education",          icon: "🎓", color: "#c4854a" },
  // { slug: "real-estate",      label: "Real Estate",        dbValue: "Real Estate",        icon: "🏠", color: "#56ccf2" },
  // { slug: "beauty-cosmetics", label: "Beauty & Cosmetics", dbValue: "Beauty & Cosmetics", icon: "💄", color: "#e879a0" },
  // { slug: "music",            label: "Music",              dbValue: "Music",              icon: "🎵", color: "#a78bfa" },
  // { slug: "game",             label: "Game",               dbValue: "Game",               icon: "🎮", color: "#6c9fff" },
  // { slug: "government",       label: "Government",         dbValue: "Government",         icon: "🏛",  color: "#e8c96a" },
  // { slug: "uncategorized",    label: "Uncategorized",      dbValue: "Uncategorized",      icon: "◉",  color: "#d4a373" },
];

export function categoryToSlug(dbValue: string): string {
  const found = CATEGORIES.find((c) => c.dbValue.toLowerCase() === dbValue.toLowerCase());
  if (found) return found.slug;
  return dbValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function slugToDbValue(slug: string): string {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.dbValue : slug;
}

export function slugToLabel(slug: string): string {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (found) return found.label;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}