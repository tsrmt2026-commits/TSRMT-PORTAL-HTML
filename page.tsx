import { redirect } from 'next/navigation';

// The root route serves the standalone portal.html (the user-facing member portal).
// portal.html lives in /public/portal.html and is also pushed to the GitHub backup repo.
// When opened on this dev server, portal.html auto-uses the local API fallback
// (/api/portal/[table]) which reads sample data from SQLite — so every feature
// (MAKLUMAT AHLI / WARIS / PLAN / GANJARAN / OSB / PDF) works immediately.
//
// The previous React admin app is preserved in ./page-react-backup.tsx and can be
// restored by swapping it back in.
export default function Page() {
  redirect('/portal8.html');
}
