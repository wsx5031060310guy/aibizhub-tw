import { NextRequest, NextResponse } from "next/server";

/**
 * Partner referral tracking. If a visitor arrives with `?ref=CODE` we save the
 * code to an httpOnly cookie that lives for 90 days. The /enterprise inquiry
 * action reads it back and persists it on the record so the partner can be
 * credited later (manual matching for now; Stripe Connect in Phase 2).
 */
const REF_COOKIE = "aib_ref";
const REF_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
const REF_PATTERN = /^[A-Za-z0-9_-]{2,32}$/;

export function middleware(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref || !REF_PATTERN.test(ref)) {
    return NextResponse.next();
  }
  // Already saved this code — don't reset the TTL on every navigation.
  if (req.cookies.get(REF_COOKIE)?.value === ref) {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  res.cookies.set(REF_COOKIE, ref, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: REF_TTL_SECONDS,
    path: "/",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|robots|sitemap).*)"],
};
