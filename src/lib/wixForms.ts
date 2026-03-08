import { supabase } from "@/integrations/supabase/client";

const WIX_FORM_ID = "ca7faeb4-1689-4856-b1a2-5d7af85a6ca7";
const WIX_SUBMISSION_URL = "https://www.wixapis.com/form-submission-service/v4/submissions";

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
    const codeDigits = formData.countryCode.replace(/\D/g, '');
    const phoneDigits = formData.phone.replace(/\D/g, '').replace(/^0+/, '');
    const fullPhone = phoneDigits ? `+${codeDigits}${phoneDigits}` : "";

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

    const { data, error } = await supabase.functions.invoke("wix-proxy", {
      body: {
        url: WIX_SUBMISSION_URL,
        method: "POST",
        payload: { submission },
      },
    });

    if (error) {
      throw new Error(error.message || "Proxy call failed");
    }

    if (data?.message || data?.details?.validationError) {
      const apiError = data?.message || "Wix validation failed";
      console.error("Wix form submission API error:", data);
      return { success: false, error: apiError };
    }

    console.log("Wix form submission success:", data);
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("Wix form submission error:", msg, e);
    return { success: false, error: msg };
  }
}

