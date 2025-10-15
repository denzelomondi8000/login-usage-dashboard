"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { useSession } from "@/lib/auth-client"
import { useEffect, useState } from "react"

interface UsageData {
  id: string;
  currentUsage: number;
  usageLimit: number;
  usagePercentage: number;
  remainingUsage: number;
  lastUpdated: string;
}

export default function Page() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsageData() {
      if (!session?.user?.id) {
        setError('Please sign in to view usage data');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/api/usage`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Please sign in to view usage data');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setUsageData(result.data);
      } catch (error) {
        console.error('Error fetching usage data:', error);
        setError('Failed to fetch usage data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [session]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards 
          usageData={usageData} 
          isLoading={isLoading || sessionLoading}
          error={error}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={[]} />
      </div>
    </div>
  )
}