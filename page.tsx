import { redirect } from 'next/navigation';

// The root route serves the standalone portal16.html (the user-facing member portal).
// portal16.html lives in /public/portal16.html and is also pushed to the GitHub backup repo.
// It is a fully standalone HTML file with embedded Supabase REST API calls.
export default function Page() {
  redirect('/portal16.html');
}
