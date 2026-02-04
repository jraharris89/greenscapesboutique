"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui";
import type { ProductFilters as FilterType, ProductCategory } from "@/types";

interface ProductFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  productCount: number;
}

const categories: { value: ProductCategory; label: string }[] = [
  { value: "tropical", label: "Tropical" },
  { value: "succulent", label: "Succulents" },
  { value: "cacti", label: "Cacti" },
  { value: "air-plants", label: "Air Plants" },
  { value: "carnivorous", label: "Carnivorous" },
  { value: "rare", label: "Rare & Unusual" },
  { value: "pots", label: "Pots & Planters" },
  { value: "bundles", label: "Bundles" },
];

const lightLevels = [
  { value: "low", label: "Low Light" },
  { value: "medium", label: "Medium Light" },
  { value: "bright", label: "Bright Indirect" },
  { value: "direct", label: "Direct Sun" },
];

const careLevels = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "expert", label: "Expert" },
];

const sizes = [
  { value: "mini", label: "Mini (2-3\")" },
  { value: "desk", label: "Desk (4-6\")" },
  { value: "medium", label: "Medium (6-10\")" },
  { value: "large", label: "Large (10-16\")" },
  { value: "statement", label: "Statement (16\"+)" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-sage-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-sage-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-sage-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-sage-500" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function ProductFilters({
  filters,
  onFilterChange,
  productCount,
}: ProductFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilter = <K extends keyof FilterType>(
    key: K,
    value: FilterType[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof FilterType>(
    key: K,
    value: string
  ) => {
    const currentValues = (filters[key] as string[] | undefined) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues.length > 0 ? (newValues as FilterType[K]) : undefined);
  };

  const clearFilters = () => {
    onFilterChange({ sortBy: filters.sortBy });
  };

  const activeFilterCount = [
    filters.categories?.length || 0,
    filters.lightLevel?.length || 0,
    filters.careLevel?.length || 0,
    filters.size?.length || 0,
    filters.isPetSafe ? 1 : 0,
    filters.isAirPurifying ? 1 : 0,
    filters.inStockOnly ? 1 : 0,
    filters.priceRange ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const filterContent = (
    <>
      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.value) || false}
                onChange={() => toggleArrayFilter("categories", category.value)}
                className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-sm text-sage-700">{category.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Light Level */}
      <FilterSection title="Light Requirements">
        <div className="space-y-2">
          {lightLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.lightLevel?.includes(level.value as "low" | "medium" | "bright" | "direct") || false}
                onChange={() => toggleArrayFilter("lightLevel", level.value)}
                className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-sm text-sage-700">{level.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Care Level */}
      <FilterSection title="Care Level">
        <div className="space-y-2">
          {careLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.careLevel?.includes(level.value as "easy" | "moderate" | "expert") || false}
                onChange={() => toggleArrayFilter("careLevel", level.value)}
                className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-sm text-sage-700">{level.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="space-y-2">
          {sizes.map((size) => (
            <label
              key={size.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.size?.includes(size.value as "mini" | "desk" | "medium" | "large" | "statement") || false}
                onChange={() => toggleArrayFilter("size", size.value)}
                className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-sm text-sage-700">{size.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Special Features */}
      <FilterSection title="Special Features">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isPetSafe || false}
              onChange={() => updateFilter("isPetSafe", !filters.isPetSafe || undefined)}
              className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
            />
            <span className="text-sm text-sage-700">Pet Safe</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isAirPurifying || false}
              onChange={() => updateFilter("isAirPurifying", !filters.isAirPurifying || undefined)}
              className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
            />
            <span className="text-sm text-sage-700">Air Purifying</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly || false}
              onChange={() => updateFilter("inStockOnly", !filters.inStockOnly || undefined)}
              className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
            />
            <span className="text-sm text-sage-700">In Stock Only</span>
          </label>
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.[0] || ""}
              onChange={(e) => {
                const min = e.target.value ? Number(e.target.value) : 0;
                const max = filters.priceRange?.[1] || 500;
                updateFilter("priceRange", [min, max]);
              }}
              className="w-full px-3 py-2 text-sm border border-sage-300 rounded-lg focus:ring-sage-500 focus:border-sage-500"
            />
            <span className="text-sage-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.[1] || ""}
              onChange={(e) => {
                const min = filters.priceRange?.[0] || 0;
                const max = e.target.value ? Number(e.target.value) : 500;
                updateFilter("priceRange", [min, max]);
              }}
              className="w-full px-3 py-2 text-sm border border-sage-300 rounded-lg focus:ring-sage-500 focus:border-sage-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full justify-center"
          >
            Clear All Filters ({activeFilterCount})
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            leftIcon={<Filter className="h-4 w-4" />}
            className="flex-1"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-sage-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort dropdown */}
          <select
            value={filters.sortBy || "featured"}
            onChange={(e) => updateFilter("sortBy", e.target.value as FilterType["sortBy"])}
            className="flex-1 px-4 py-2.5 bg-white border border-sage-300 rounded-lg text-sage-900 focus:ring-sage-500 focus:border-sage-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-sage-950/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-sage-200 p-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-sage-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-sage-600 hover:text-sage-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">{filterContent}</div>
            <div className="sticky bottom-0 bg-white border-t border-sage-200 p-4">
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full"
              >
                Show {productCount} Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-sage-900 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-sage-100 text-sage-700 text-xs px-2 py-1 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
