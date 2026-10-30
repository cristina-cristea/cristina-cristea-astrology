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
  gdprConsent: boolean;
  submittedAt: string;
}
