import { supabase } from "@/integrations/supabase/client";

const WIX_FORM_ID = "ca7faeb4-1689-4856-b1a2-5d7af85a6ca7";
const SUBMISSIONS_URL = "https://www.wixapis.com/wix-forms/v4/submissions";

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
    const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}` : "";

    const payload = {
      submission: {
        formId: WIX_FORM_ID,
        submissions: {
          email_6626: formData.email,
          phone_81eb: fullPhone,
          subject: formData.subject,
          inquiry_type: formData.inquiryType,
          message: formData.message,
        },
      },
    };

    const { data, error } = await supabase.functions.invoke("wix-proxy", {
      body: {
        url: SUBMISSIONS_URL,
        method: "POST",
        payload,
      },
    });

    if (error) {
      console.error("Wix form submission proxy error:", error);
      return { success: false, error: error.message };
    }

    // Wix returns error details in the response body
    if (data?.message || data?.details) {
      console.error("Wix form submission API error:", data);
      return { success: false, error: data.message || JSON.stringify(data.details) };
    }

    console.log("Wix form submission success:", data);
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("Wix form submission error:", msg);
    return { success: false, error: msg };
  }
}
