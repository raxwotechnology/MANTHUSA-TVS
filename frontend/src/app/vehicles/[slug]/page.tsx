import { redirect } from 'next/navigation';

export default async function LegacyVehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/bikes/${slug}`);
}
