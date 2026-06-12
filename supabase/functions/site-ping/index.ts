const DEFAULT_ALLOWED_ORIGINS = "https://www.steelit.site,https://steelit.site";
const DEFAULT_COOLDOWN_MINUTES = 1440;
const SITE_NAME = "steelit-website";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

function textEnv(name: string, fallback = "") {
  return (Deno.env.get(name) || fallback).trim();
}

function getAllowedOrigins() {
  return textEnv("VISIT_ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null) {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || "https://www.steelit.site";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...corsHeaders(origin) }
  });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function lookupGeo(ipAddress: string, fallbackCountryCode: string) {
  const fallback = {
    country: fallbackCountryCode,
    countryCode: fallbackCountryCode,
    city: "",
    region: "",
    source: fallbackCountryCode ? "headers" : ""
  };

  if (!ipAddress || ipAddress === "unknown") return fallback;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ipAddress)}`);
    if (!response.ok) return fallback;

    const data = await response.json();
    if (data?.success === false) return fallback;

    return {
      country: cleanText(data?.country, 80) || fallback.country,
      countryCode: cleanText(data?.country_code, 8) || fallback.countryCode,
      city: cleanText(data?.city, 120),
      region: cleanText(data?.region, 120),
      source: "ipwho.is"
    };
  } catch {
    return fallback;
  }
}

async function sha256Hex(value: string) {
  const input = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getSupabaseSecretKey() {
  return textEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function supabaseHeaders(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json"
  };
}

async function hasRecentNotification(
  supabaseUrl: string,
  secretKey: string,
  ipHash: string,
  cooldownMinutes: number
) {
  const since = new Date(Date.now() - cooldownMinutes * 60_000).toISOString();
  const params = new URLSearchParams({
    select: "id",
    site: `eq.${SITE_NAME}`,
    ip_hash: `eq.${ipHash}`,
    notified: "eq.true",
    created_at: `gte.${since}`,
    limit: "1"
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/visit_events?${params}`, {
    headers: supabaseHeaders(secretKey)
  });

  if (!response.ok) throw new Error(`recent visit check failed: ${response.status}`);
  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function insertVisitEvent(
  supabaseUrl: string,
  secretKey: string,
  row: Record<string, unknown>
) {
  const response = await fetch(`${supabaseUrl}/rest/v1/visit_events`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(secretKey),
      Prefer: "return=minimal"
    },
    body: JSON.stringify(row)
  });

  if (!response.ok) throw new Error(`visit insert failed: ${response.status}`);
}

async function publishNtfy(message: string) {
  const topic = textEnv("NTFY_TOPIC");
  if (!topic) return false;

  const baseUrl = textEnv("NTFY_BASE_URL", "https://ntfy.sh").replace(/\/+$/, "");
  const token = textEnv("NTFY_BEARER_TOKEN");
  const headers: Record<string, string> = {
    Title: textEnv("NTFY_TITLE", "Steelit website visit"),
    Priority: textEnv("NTFY_PRIORITY", "3"),
    Tags: textEnv("NTFY_TAGS", "building,steel"),
    Click: textEnv("VISIT_CLICK_URL", "https://www.steelit.site/")
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/${encodeURIComponent(topic)}`, {
    method: "POST",
    headers,
    body: message
  });

  if (!response.ok) throw new Error(`ntfy publish failed: ${response.status}`);
  return true;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405, origin);
  }

  const allowedOrigins = getAllowedOrigins();
  if (!origin || !allowedOrigins.includes(origin)) {
    return jsonResponse({ ok: false, error: "origin_not_allowed" }, 403, origin);
  }

  const supabaseUrl = textEnv("SUPABASE_URL");
  const secretKey = getSupabaseSecretKey();
  const salt = textEnv("VISIT_HASH_SALT");

  if (!supabaseUrl || !secretKey || !salt) {
    return jsonResponse({ ok: true, notified: false, reason: "not_configured" }, 200, origin);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const path = cleanText(payload.path, 300) || "/";
  const referrer = cleanText(payload.referrer, 500);
  const timezone = cleanText(payload.timezone, 80);
  const userAgent = cleanText(request.headers.get("user-agent"), 500);
  const headerCountryCode = cleanText(request.headers.get("cf-ipcountry"), 8);
  const ipAddress = cleanText(getClientIp(request), 80);
  const geo = await lookupGeo(ipAddress, headerCountryCode);
  const ipHash = await sha256Hex(`${salt}:${ipAddress}`);
  const cooldownMinutes = Number(textEnv("VISIT_NOTIFY_COOLDOWN_MINUTES", String(DEFAULT_COOLDOWN_MINUTES))) || DEFAULT_COOLDOWN_MINUTES;

  try {
    const alreadyNotified = await hasRecentNotification(
      supabaseUrl,
      secretKey,
      ipHash,
      cooldownMinutes
    );

    let notificationSent = false;
    if (!alreadyNotified) {
      const referrerLine = referrer ? `\nReferrer: ${referrer}` : "";
      const ipLine = ipAddress ? `\nIP: ${ipAddress}` : "";
      const countryLine = geo.country ? `\nCountry: ${geo.country}` : "";
      const cityLine = geo.city ? `\nCity: ${geo.city}` : "";
      const regionLine = geo.region ? `\nRegion: ${geo.region}` : "";
      const message = `New Steelit website visitor\nPath: ${path}${ipLine}${countryLine}${cityLine}${regionLine}${referrerLine}`;
      notificationSent = await publishNtfy(message);
    }

    await insertVisitEvent(supabaseUrl, secretKey, {
      site: SITE_NAME,
      path,
      referrer,
      user_agent: userAgent,
      ip_address: ipAddress,
      ip_hash: ipHash,
      country: geo.country,
      country_code: geo.countryCode,
      city: geo.city,
      region: geo.region,
      location_source: geo.source,
      timezone,
      notified: notificationSent
    });

    return jsonResponse({ ok: true, notified: notificationSent }, 200, origin);
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: true, notified: false, reason: "internal_error" }, 200, origin);
  }
});
