export type Glyph =
  | "sun" | "moon" | "rising" | "venus" | "saturn"
  | "chart" | "transits" | "star" | "comet" | "eclipse";

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
  /** The session time booked through Cal.com, as ISO timestamps. */
  slot?: { start: string; end: string; uid?: string };
  gdprConsent: boolean;
  submittedAt: string;
}

/** Only readings are sold, so a line is always one booked session. */
export interface CartLine {
  id: string;
  slug: string;
  name: string;
  price: number;
  /** Currency the price was shown in when the reading was added. */
  currency: string;
  intake: IntakeData;
}
