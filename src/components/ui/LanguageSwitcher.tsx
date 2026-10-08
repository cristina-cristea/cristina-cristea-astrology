import { DropdownMenu } from "radix-ui";
import { Check, Globe } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { LOCALES, LOCALE_META } from "../../i18n/types";
import type { Locale } from "../../i18n/types";

/**
 * Language menu built on Radix DropdownMenu with a radio group, which gives
 * the correct semantics (menuitemradio with a checked state), roving focus,
 * type-ahead, arrow-key navigation, Escape to dismiss and focus return to the
 * trigger — all of which the previous hand-rolled listbox only partly had.
 *
 * Each item declares its own `lang` so a screen reader pronounces "Français"
 * in French rather than reading it as English.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`lang__trigger${compact ? " lang__trigger--compact" : ""}`}
          aria-label={`${t.nav.primary} — ${LOCALE_META[locale].label}`}
        >
          <Globe size={15} strokeWidth={1.3} aria-hidden="true" />
          <span>{LOCALE_META[locale].short}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="lang__menu" sideOffset={6} align="end">
          <DropdownMenu.RadioGroup
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
          >
            {LOCALES.map((l) => (
              <DropdownMenu.RadioItem
                key={l}
                value={l}
                lang={LOCALE_META[l].htmlLang}
                className="lang__opt"
              >
                <span>{LOCALE_META[l].label}</span>
                <DropdownMenu.ItemIndicator asChild>
                  <Check size={13} strokeWidth={1.8} aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
