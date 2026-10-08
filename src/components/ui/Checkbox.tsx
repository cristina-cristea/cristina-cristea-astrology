import { Checkbox as C } from "radix-ui";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Checkbox built on Radix. It renders a button with role="checkbox" plus a
 * hidden native input, so `required` still participates in form validation
 * while the visual box is fully styleable.
 *
 * The label is a sibling bound with htmlFor rather than a wrapper, because the
 * Radix control is a button and cannot be an implicitly labelled form field.
 */
export function Checkbox({
  id,
  checked,
  onChange,
  children,
  describedBy,
  invalid,
  required,
  inline,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
  inline?: boolean;
}) {
  return (
    <div className={`check${inline ? " check--inline" : ""}${invalid ? " check--error" : ""}`}>
      <C.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="check__box"
      >
        <C.Indicator asChild>
          <Check size={12} strokeWidth={2.4} aria-hidden="true" />
        </C.Indicator>
      </C.Root>
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
