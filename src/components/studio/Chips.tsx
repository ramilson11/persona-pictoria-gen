import { cn } from "@/lib/utils";

export type ChipOption<T extends string> = {
  id: T;
  label: string;
  hint?: string;
};

export function Field({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">{label}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  columns,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (id: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        columns ? "grid gap-1.5" : "flex flex-wrap gap-1.5",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            title={option.hint}
            onClick={() => onChange(option.id)}
            className={cn(
              "chip cursor-pointer justify-center text-center hover:border-primary/60",
              columns ? "flex-col items-center gap-0.5 px-2 py-2" : undefined,
              active && "chip-active",
            )}
          >
            <span>{option.label}</span>
            {columns && option.hint ? (
              <span className={cn("text-[0.62rem] leading-tight opacity-70", active && "opacity-80")}>
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
