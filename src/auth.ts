import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js v5 config. We register Google as the primary provider but only when
 * credentials are present, so the app builds and runs cleanly in environments
 * without OAuth set up (e.g. local dev, preview deploys before secrets land).
 *
 * The Credentials demo provider lets the founder show the platform to
 * partners before Google OAuth is fully provisioned. It accepts any email
 * + password === "demo" and creates a session — clearly marked as demo.
 * Disable via AIBIZHUB_DEMO_LOGIN=0 once Google OAuth is live.
 */
const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AIBIZHUB_DEMO_LOGIN !== "0") {
  providers.push(
    Credentials({
      id: "demo",
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password (demo)", type: "password" },
      },
      authorize: async (creds) => {
        const email = creds?.email as string | undefined;
        const password = creds?.password as string | undefined;
        if (!email || password !== "demo") return null;
        return {
          id: `demo-${Buffer.from(email).toString("base64url")}`,
          email,
          name: email.split("@")[0],
        };
      },
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const protectedPath = path.startsWith("/dashboard");
      if (protectedPath) return !!auth;
      return true;
    },
  },
});
