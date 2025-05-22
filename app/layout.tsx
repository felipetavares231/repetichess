// app/layout.tsx
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
    <html lang="en">
      <body>
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
                  backgroundColor: "#9c2133",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "9999px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "14px",
                }}>
                ☕ Support me
              </a>

              {/* Footer */}
              <footer
                style={{
                  marginTop: "3rem",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#9c2133",
                }}>
                ♟️ Built by Felipe Tavares —{" "}
                <a
                  href="https://ko-fi.com/felipetpadua"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: "#9c2133", fontWeight: "500"}}>
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
