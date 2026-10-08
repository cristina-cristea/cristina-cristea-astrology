import { RadioGroup as R } from "radix-ui";
import type { ReactNode } from "react";

/**
 * Radio group built on Radix, which implements the roving-tabindex pattern:
 * the group is one tab stop and arrow keys move between options, as the ARIA
 * spec requires. A set of plain inputs makes each option its own tab stop.
 */
export function RadioGroup({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <R.Root value={value} onValueChange={onChange} aria-label={label} className="pay">
      {children}
    </R.Root>
  );
}

export function RadioOption({
  value,
  icon,
  title,
  hint,
}: {
  value: string;
  icon: ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <label className="pay__opt">
      <R.Item value={value} className="pay__dot">
        <R.Indicator className="pay__dot-fill" />
      </R.Item>
      {icon}
      <span>
        <strong>{title}</strong>
        <em>{hint}</em>
      </span>
    </label>
  );
}
