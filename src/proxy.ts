import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/set-password"];

function isProtectedAdminPath(pathname: string) {
  const withoutLocale = pathname.replace(localePattern, "") || "/";
  return (
    withoutLocale.startsWith("/admin") &&
    !PUBLIC_ADMIN_PATHS.some((path) => withoutLocale.startsWith(path))
  );
}

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedAdminPath(request.nextUrl.pathname) && !user) {
    const localeMatch = request.nextUrl.pathname.match(localePattern);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
