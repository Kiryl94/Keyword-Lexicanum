type RecentLookupListProps = {
  items: string[];
  onSelect: (keyword: string) => void;
  onClear: () => void;
};

export function RecentLookupList({ items, onSelect, onClear }: RecentLookupListProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-[#a0a0b0]">Recent lookups</p>
        <button
          type="button"
          onClick={onClear}
          className="min-h-[44px] shrink-0 rounded-lg bg-[#e94560] px-4 py-2 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-white transition-colors hover:bg-[#d63d56] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f1a]"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="min-h-[44px] rounded-full border border-[#2a2a40] bg-[#1a1a2e] px-3 py-2 text-sm text-[#e94560] transition-colors hover:border-[#e94560] hover:bg-[#16213e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
