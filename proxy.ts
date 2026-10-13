import { NextResponse, type NextRequest } from "next/server"
import { markdownFor, prefersMarkdown } from "@/lib/agent-markdown"

// Content negotiation: an agent that asks for text/markdown gets a Markdown version of the page
// (or a Markdown 404) with "Vary: Accept"; browsers asking for HTML get the normal site.
// The proxy runs before Vercel's cache on every request, so the two versions never mix.
export function proxy(request: NextRequest) {
  // A malformed escape like %E0%A4%A would make Next.js (and markdownFor) throw a 500: answer 400 instead.
  try {
    decodeURIComponent(request.nextUrl.pathname)
  } catch {
    return new NextResponse("Bad request", { status: 400 })
  }

  if (prefersMarkdown(request.headers.get("accept"))) {
    const { status, body } = markdownFor(request.nextUrl.pathname)
    return new NextResponse(request.method === "HEAD" ? null : body, {
      status,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Robots-Tag": "noindex",
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  // Pages only: skip Next.js internals, Vercel's own paths and any file with an extension.
  matcher: ["/((?!_next/|_vercel/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
}
