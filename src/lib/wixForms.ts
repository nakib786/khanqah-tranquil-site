import { wixClient } from "@/lib/wixClient";

const WIX_FORM_ID = "ca7faeb4-1689-4856-b1a2-5d7af85a6ca7";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  subject: string;
  inquiryType: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Wix requires E.164 phone format: +<countrycode><number>
    const rawPhone = formData.phone.trim();
    const phoneDigits = rawPhone.replace(/\D/g, '');
    const countryDigits = formData.countryCode.replace(/\D/g, '');
    const normalizedCountryCode = countryDigits ? `+${countryDigits}` : '+91';

    const normalizedPhoneDigits = rawPhone.startsWith('+')
      ? phoneDigits
      : phoneDigits.replace(/^0+/, '');

    const fullPhone = normalizedPhoneDigits
      ? (rawPhone.startsWith('+') ? `+${normalizedPhoneDigits}` : `${normalizedCountryCode}${normalizedPhoneDigits}`)
      : "";

    const submission = {
      formId: WIX_FORM_ID,
      submissions: {
        full_name: formData.name,
        email_6626: formData.email,
        phone_81eb: fullPhone,
        subject: formData.subject,
        inquiry_type: formData.inquiryType,
        message: formData.message,
      },
    };

    const result = await wixClient.submissions.createSubmission(submission);
    console.log("Wix form submission success:", result);
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("Wix form submission error:", msg, e);
    return { success: false, error: msg };
  }
}
