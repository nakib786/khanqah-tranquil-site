import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const WIX_API_TOKEN = Deno.env.get("WIX_API_TOKEN");
  if (!WIX_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: "WIX_API_TOKEN not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const WIX_SITE_ID = Deno.env.get("WIX_SITE_ID");
  if (!WIX_SITE_ID) {
    return new Response(
      JSON.stringify({ error: "WIX_SITE_ID not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { url, method = "GET", payload } = body as {
      url: string;
      method?: string;
      payload?: unknown;
    };

    console.log(`[wix-proxy] ${method} ${url}`);

    if (!url || !url.startsWith("https://www.wixapis.com/")) {
      return new Response(
        JSON.stringify({ error: "Invalid Wix API URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const wixHeaders: Record<string, string> = {
      Authorization: WIX_API_TOKEN,
      "wix-site-id": WIX_SITE_ID,
      "Content-Type": "application/json",
    };

    const fetchOptions: RequestInit = {
      method,
      headers: wixHeaders,
    };

    if (payload && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(payload);
      console.log(`[wix-proxy] Payload:`, JSON.stringify(payload).substring(0, 500));
    }

    const wixRes = await fetch(url, fetchOptions);
    const text = await wixRes.text();
    console.log(`[wix-proxy] Response status: ${wixRes.status}`);
    console.log(`[wix-proxy] Response body: ${text.substring(0, 500)}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawResponse: text };
    }

    return new Response(JSON.stringify(data), {
      status: wixRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("wix-proxy error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
