// app/layout.tsx
import "./lib/polyfill-storage";
import type {Metadata} from "next";
import {StackProvider, StackTheme} from "@stackframe/stack";
import {stackServerApp} from "../stack";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repeti Chess",
  description: "Learn Chess Openings with Spaced Repetition System",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Providers>
              {children}
              <a
                href="https://ko-fi.com/felipetpadua"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  zIndex: 1000,
                  background: "linear-gradient(135deg, #9c2133 0%, #c94a5c 100%)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 14px rgba(156,33,51,0.4)",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "13px",
                  letterSpacing: "0.01em",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}>
                ☕ Support me
              </a>

              <footer
                style={{
                  marginTop: "3rem",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.35)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                ♟ Built by Felipe Tavares —{" "}
                <a
                  href="https://ko-fi.com/felipetpadua"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#c94a5c",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}>
                  Buy me a coffee
                </a>
              </footer>
            </Providers>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
