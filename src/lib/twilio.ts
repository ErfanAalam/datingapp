import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

function getClient() {
  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error(
      "Twilio is not fully configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID in your env.",
    );
  }
  return twilio(accountSid, authToken);
}

export async function sendOtp(phoneE164: string) {
  const client = getClient();
  const verification = await client.verify.v2
    .services(verifyServiceSid as string)
    .verifications.create({ to: phoneE164, channel: "sms" });
  return { status: verification.status, sid: verification.sid };
}

export async function checkOtp(phoneE164: string, code: string) {
  const client = getClient();
  const check = await client.verify.v2
    .services(verifyServiceSid as string)
    .verificationChecks.create({ to: phoneE164, code });
  return { status: check.status, valid: check.status === "approved" };
}
