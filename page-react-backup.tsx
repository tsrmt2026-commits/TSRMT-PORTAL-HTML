'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Load the main page component with SSR disabled to prevent hydration mismatch.
// This ensures the page is ONLY rendered on the client side,
// completely eliminating any server/client HTML differences.
const HomeClient = dynamic(() => import('./home-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-amber-400 text-sm font-semibold">Memuatkan Portal...</p>
      </div>
    </div>
  ),
});

// Supabase test panel — only loaded when ?test=supabase is in the URL.
// This is a PREVIEW ONLY and does not affect the main portal.
const SupabaseTestPanel = dynamic(() => import('./supabase-test-panel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  ),
});

function RouteSwitcher() {
  const searchParams = useSearchParams();
  const isSupabaseTest = searchParams?.get('test') === 'supabase';

  if (isSupabaseTest) {
    return <SupabaseTestPanel />;
  }
  return <HomeClient />;
}

// Floating download button — links to the standalone portal.html download guide.
// Visible at top-right of every page so user can easily download the HTML version.
function DownloadPortalButton() {
  return (
    <a
      href="/download-guide.html"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 99999,
        background: 'linear-gradient(90deg, #d97706, #fbbf24, #d97706)',
        color: '#1a1024',
        padding: '0.55rem 1rem',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 900,
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(251,191,36,0.5)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        letterSpacing: '0.04em',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <span style={{ fontSize: '0.95rem' }}>📥</span>
      DOWNLOAD PORTAL HTML
    </a>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DownloadPortalButton />
      <RouteSwitcher />
    </Suspense>
  );
}
