import { Select as S } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

/**
 * Select built on Radix. Replaces the native <select>, which could not be
 * styled consistently across browsers and gave no control over the option
 * list. Radix supplies arrow-key navigation, type-ahead, Escape, and a proper
 * listbox/option role pairing.
 *
 * Styling comes from the project's CSS tokens, not utility classes.
 */
export function Select({
  id,
  value,
  onChange,
  options,
  describedBy,
  invalid,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
}) {
  return (
    <S.Root value={value} onValueChange={onChange} required={required}>
      <S.Trigger
        id={id}
        className="sel__trigger"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
      >
        <S.Value />
        <S.Icon asChild>
          <ChevronDown size={16} strokeWidth={1.4} aria-hidden="true" />
        </S.Icon>
      </S.Trigger>

      <S.Portal>
        <S.Content className="sel__content" position="popper" sideOffset={6}>
          <S.Viewport className="sel__viewport">
            {options.map((o) => (
              <S.Item key={o} value={o} className="sel__item">
                <S.ItemText>{o}</S.ItemText>
                <S.ItemIndicator asChild>
                  <Check size={13} strokeWidth={1.8} aria-hidden="true" />
                </S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
