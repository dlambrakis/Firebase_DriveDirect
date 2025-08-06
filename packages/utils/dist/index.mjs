// src/date.ts
import { format, parseISO } from "date-fns";
var formatDate = (date, formatString = "MMMM d, yyyy") => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "";
  }
};
var formatDateTimeShort = (date) => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return format(dateObj, "MMM d, p");
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "";
  }
};

// src/filterFormatting.ts
var formatFilterValue = (key, value, allFilters) => {
  const formatPrice2 = (price) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
  const formatKm = (km) => `${new Intl.NumberFormat("en-ZA").format(km)} km`;
  if (Array.isArray(value)) return value.join(", ");
  if (key === "minPrice" && allFilters.maxPrice) return `${formatPrice2(value)} - ${formatPrice2(allFilters.maxPrice)}`;
  if (key === "maxPrice" && !allFilters.minPrice) return `< ${formatPrice2(value)}`;
  if (key === "minPrice") return `> ${formatPrice2(value)}`;
  if (key === "minMileage" && allFilters.maxMileage) return `${formatKm(value)} - ${formatKm(allFilters.maxMileage)}`;
  if (key === "maxMileage" && !allFilters.minMileage) return `< ${formatKm(value)}`;
  if (key === "minMileage") return `> ${formatKm(value)}`;
  if (key === "minYear" && allFilters.maxYear) return `${value} - ${allFilters.maxYear}`;
  if (key === "maxYear" && !allFilters.minYear) return `< ${value}`;
  if (key === "minYear") return `> ${value}`;
  return String(value);
};
var formatFilterLabel = (key) => {
  return key.replace(/([A-Z])/g, " $1").replace(/\b(min|max)\b/g, "").replace(/\b\w/g, (l) => l.toUpperCase()).trim();
};
var getActiveFilters = (filters) => {
  const activeFilters = [];
  const filterKeys = Object.keys(filters);
  filterKeys.forEach((key) => {
    const value = filters[key];
    if (key !== "pageNumber" && key !== "pageSize" && key !== "searchTerm" && value !== void 0 && value !== "" && value !== 0 && (!Array.isArray(value) || value.length > 0)) {
      activeFilters.push([key, value]);
    }
  });
  return activeFilters;
};

// src/formatting.ts
var formatPrice = (price) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(price);
};
var formatMileage = (mileage) => {
  return `${new Intl.NumberFormat("en-ZA", { useGrouping: true }).format(mileage)} km`;
};
export {
  formatDate,
  formatDateTimeShort,
  formatFilterLabel,
  formatFilterValue,
  formatMileage,
  formatPrice,
  getActiveFilters
};
//# sourceMappingURL=index.mjs.map