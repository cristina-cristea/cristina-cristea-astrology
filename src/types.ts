export type Glyph =
  | "sun" | "moon" | "rising" | "venus" | "saturn"
  | "chart" | "orbit" | "star" | "comet" | "eclipse";

/** Birth data captured before checkout for any chart service. */
export interface IntakePerson {
  fullName: string;
  birthDate: string;   // yyyy-mm-dd
  birthTime: string;   // HH:mm
  timeUnknown: boolean;
  birthPlace: string;  // "City, Country"
}

export interface IntakeData extends IntakePerson {
  email: string;
  partner?: IntakePerson;
  targetYear?: string;
  focus: string;
  gdprConsent: boolean;
  marketingOptIn: boolean;
  submittedAt: string;
}

export type CartLine =
  | { kind: "service"; id: string; slug: string; name: string; price: number; qty: 1; intake: IntakeData }
  | { kind: "merch"; id: string; slug: string; name: string; price: number; qty: number; variant?: string };
