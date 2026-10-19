/**
 * Sends the contact form through Web3Forms (https://web3forms.com), which
 * emails each message to the address the access key was created for
 * (cristina.cristea17@gmail.com). The site is static, so there is no server
 * of our own to send mail from.
 *
 * The access key is public by design: it is meant to sit in client code and
 * can only deliver messages to that one inbox. To change the receiving
 * address, create a new key at web3forms.com and replace it here.
 */
const ACCESS_KEY = "b75b0326-be39-4934-a560-03b3abbad644";
const ENDPOINT = "https://api.web3forms.com/submit";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot. Real visitors never see or fill it; bots usually do. */
  botcheck: boolean;
}

/** Resolves when Web3Forms accepts the message; throws otherwise. */
export async function sendContactMessage(msg: ContactMessage): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `Website message: ${msg.subject}`,
      from_name: "Cristina Cristea — website",
      name: msg.name,
      email: msg.email, // Web3Forms uses this as the reply-to address
      topic: msg.subject,
      message: msg.message,
      botcheck: msg.botcheck,
    }),
  });

  let data: { success?: boolean; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Web3Forms responded ${res.status}`);
  }
}
