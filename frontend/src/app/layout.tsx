import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth.context";
import { SongProvider } from "@/context/song.context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SoundWave - Stream Music Online",
  description: "Discover, stream, and enjoy millions of songs on SoundWave. Create playlists, explore albums, and enjoy high-quality music streaming with a beautiful interface.",
  keywords: ["music", "streaming", "soundwave", "songs", "albums", "playlists", "audio"],
  authors: [{ name: "SoundWave Team" }],
  creator: "SoundWave Platform",
  publisher: "SoundWave",
  robots: "index, follow",
  openGraph: {
    title: "SoundWave - Stream Music Online",
    description: "Discover, stream, and enjoy millions of songs with SoundWave platform.",
    type: "website",
    locale: "en_US",
    siteName: "SoundWave",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoundWave - Stream Music Online",
    description: "Discover, stream, and enjoy millions of songs with SoundWave platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-inter `}
      >
        <AuthProvider>
          <SongProvider>
            {children}
          </SongProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
