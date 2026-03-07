interface CategoryFilterProps {
  categories: Array<Record<string, unknown>>;
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  allLabel?: string;
}

const CategoryFilter = ({ categories, activeCategoryId, onSelect, allLabel = 'All' }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`text-sm px-3 py-1 rounded-full border transition-colors ${
          !activeCategoryId ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((cat) => {
        const id = (cat._id as string) ?? '';
        const label = (cat.label as string) ?? (cat.name as string) ?? '';
        return (
          <button
            key={id}
            onClick={() => onSelect(id === activeCategoryId ? null : id)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              activeCategoryId === id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
