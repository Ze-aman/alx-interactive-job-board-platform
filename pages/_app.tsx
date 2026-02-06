// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; 
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Combine checks: If it starts with /dashboard OR /employer, it's a "portal" page
  const isPortal = router.pathname.startsWith('/dashboard') || router.pathname.startsWith('/employer') || router.pathname.startsWith('/admin');

  return (
    <>
      {/* Show Header/Footer ONLY if NOT in a portal */}
      {!isPortal && <Header />}
      
      <main>
        <Component {...pageProps} />
      </main>

      {!isPortal && <Footer />}
    </>
  );
}