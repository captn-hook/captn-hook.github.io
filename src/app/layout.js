import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

// Runs before paint so a saved theme choice doesn't flash the system theme first.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata = {
  metadataBase: new URL("https://captn-hook.github.io"),
  title: "Tristan Hook",
  description: "Tristan Hook: software engineer, 3D designer and data visualization developer.",
  openGraph: {
    title: "Tristan Hook",
    description: "Software engineer, 3D designer and data visualization developer.",
    url: "/",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#17161b" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
