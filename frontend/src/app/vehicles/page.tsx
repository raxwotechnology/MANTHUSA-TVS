import { redirect } from 'next/navigation';

export default function VehiclesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  // Gracefully redirect legacy /vehicles to /bikes
  redirect('/bikes');
}
