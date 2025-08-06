"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  formatDate: () => formatDate,
  formatDateTimeShort: () => formatDateTimeShort,
  formatFilterLabel: () => formatFilterLabel,
  formatFilterValue: () => formatFilterValue,
  formatMileage: () => formatMileage,
  formatPrice: () => formatPrice,
  getActiveFilters: () => getActiveFilters
});
module.exports = __toCommonJS(index_exports);

// src/date.ts
var import_date_fns = require("date-fns");
var formatDate = (date, formatString = "MMMM d, yyyy") => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? (0, import_date_fns.parseISO)(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return (0, import_date_fns.format)(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "";
  }
};
var formatDateTimeShort = (date) => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? (0, import_date_fns.parseISO)(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return (0, import_date_fns.format)(dateObj, "MMM d, p");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatDate,
  formatDateTimeShort,
  formatFilterLabel,
  formatFilterValue,
  formatMileage,
  formatPrice,
  getActiveFilters
});
//# sourceMappingURL=index.js.map