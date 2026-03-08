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
    // Build E.164 phone: +<countrycode><subscriber number>
    // Strip everything except digits from both parts
    const codeDigits = formData.countryCode.replace(/\D/g, '');
    const phoneDigits = formData.phone.replace(/\D/g, '').replace(/^0+/, ''); // strip leading zeros
    const fullPhone = phoneDigits ? `+${codeDigits}${phoneDigits}` : "";

    console.log("Submitting to Wix with phone:", fullPhone, "country code:", formData.countryCode, "raw phone:", formData.phone);

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
