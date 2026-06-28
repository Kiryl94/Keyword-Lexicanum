'use client';

type KeywordSuggestionListProps = {
  suggestions: string[];
  onSelect: (keyword: string) => void;
  className?: string;
  ariaLabel?: string;
};

export function KeywordSuggestionList({
  suggestions,
  onSelect,
  className = '',
  ariaLabel = 'Keyword suggestions',
}: KeywordSuggestionListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul
      role="listbox"
      aria-label={ariaLabel}
      className={`flex flex-col overflow-hidden rounded-lg border border-[#2a2a40] bg-[#1a1a2e] ${className}`}
    >
      {suggestions.map((keyword) => (
        <li key={keyword} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => onSelect(keyword)}
            className="min-h-[44px] w-full border-b border-[#2a2a40] px-4 py-2 text-left text-[#f5f5f5] last:border-b-0 hover:bg-[#252540] focus:border-[#e94560] focus:bg-[#252540] focus:outline-none"
          >
            {keyword}
          </button>
        </li>
      ))}
    </ul>
  );
}
