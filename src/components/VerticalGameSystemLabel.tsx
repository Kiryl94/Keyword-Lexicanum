type VerticalGameSystemLabelProps = {
  className?: string;
};

export function VerticalGameSystemLabel({ className = '' }: VerticalGameSystemLabelProps) {
  const label = 'Game System';

  return (
    <div
      className={`flex flex-col items-center text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-[#a0a0b0] ${className}`}
      aria-hidden="true"
    >
      {label.split('').map((char, index) =>
        char === ' ' ? (
          <span key={index} className="h-1" />
        ) : (
          <span key={index} className="py-[1px]">
            {char}
          </span>
        ),
      )}
    </div>
  );
}
