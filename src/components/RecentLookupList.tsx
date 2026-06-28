type RecentLookupListProps = {
  items: string[];
  onSelect: (keyword: string) => void;
};

export function RecentLookupList({ items, onSelect }: RecentLookupListProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="font-semibold text-[#a0a0b0]">Recent lookups</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="rounded-full border border-[#2a2a40] bg-[#1a1a2e] px-3 py-1.5 text-sm text-[#e94560] transition-colors hover:border-[#e94560] hover:bg-[#16213e]"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
