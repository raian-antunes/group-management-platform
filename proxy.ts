import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"
import { USER_ROLE } from "./drizzle/schema"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!!!"
)

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/signup")
  ) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET)
      const role = payload.userRole as string

      if (!request.nextUrl.pathname.endsWith("/dashboard")) {
        if (role === USER_ROLE.admin.value) {
          if (!request.nextUrl.pathname.startsWith("/dashboard/intentions")) {
            return new NextResponse(null, { status: 403 })
          }
        }

        if (role === USER_ROLE.user.value) {
          if (!request.nextUrl.pathname.startsWith("/dashboard/user/edit")) {
            return new NextResponse(null, { status: 403 })
          }
        }
      }
    } catch {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  return NextResponse.next()
}
