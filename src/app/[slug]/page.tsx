import { fetchDestination, fetchExperiences } from "@/lib/api";
import { ClientShell } from "@/components/ClientShell";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [destination, experiences] = await Promise.all([
    fetchDestination(slug),
    fetchExperiences(slug),
  ]);

  return <ClientShell destination={destination} experiences={experiences} />;
}
