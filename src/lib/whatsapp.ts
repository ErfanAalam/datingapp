export const TEST_OTP = "123456";

export async function sendWhatsAppOtp(phoneE164: string) {
  console.warn(
    `[whatsapp] Template not verified yet — skipping API send. Use code ${TEST_OTP} for ${phoneE164}.`,
  );
  return { status: "dev_skipped", code: TEST_OTP };
}

export function verifyTestOtp(code: string) {
  return code === TEST_OTP;
}
