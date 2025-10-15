import { IconTrendingDown, IconTrendingUp, IconAlertTriangle, IconCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface UsageData {
  currentUsage: number;
  usageLimit: number;
  usagePercentage: number;
  remainingUsage: number;
  lastUpdated: string;
}

interface SectionCardsProps {
  usageData?: UsageData | null;
  isLoading?: boolean;
  error?: string | null;
}

export function SectionCards({ usageData, isLoading, error }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : error ? (
              "Error"
            ) : usageData ? (
              `${usageData.currentUsage} / ${usageData.usageLimit}`
            ) : (
              "No data"
            )}
          </CardTitle>
          <CardAction>
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : error ? (
              <Badge variant="destructive">
                <IconAlertTriangle className="size-3" />
                Error
              </Badge>
            ) : usageData ? (
              <Badge variant={usageData.usagePercentage > 80 ? "destructive" : usageData.usagePercentage > 60 ? "default" : "secondary"}>
                {usageData.usagePercentage > 80 ? (
                  <IconAlertTriangle className="size-3" />
                ) : usageData.usagePercentage > 60 ? (
                  <IconTrendingUp className="size-3" />
                ) : (
                  <IconCheck className="size-3" />
                )}
                {usageData.usagePercentage}%
              </Badge>
            ) : (
              <Badge variant="secondary">0%</Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3">
          {isLoading ? (
            <Skeleton className="h-2 w-full" />
          ) : usageData ? (
            <Progress 
              value={usageData.usagePercentage} 
              className="w-full"
            />
          ) : null}
          <div className="flex flex-col gap-1.5 text-sm w-full">
            <div className="line-clamp-1 flex gap-2 font-medium justify-between">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : error ? (
                <span className="text-destructive">Error: {error}</span>
              ) : usageData ? (
                <>
                  <span>{usageData.remainingUsage} remaining</span>
                  <span className="text-muted-foreground">
                    {usageData.usagePercentage > 80 
                      ? "⚠️ High usage" 
                      : usageData.usagePercentage > 60 
                      ? "📊 Moderate usage" 
                      : "✅ Good standing"
                    }
                  </span>
                </>
              ) : (
                <span>No usage data available</span>
              )}
            </div>
            <div className="text-muted-foreground text-xs">
              {isLoading ? (
                <Skeleton className="h-3 w-40" />
              ) : usageData ? (
                `Last updated: ${new Date(usageData.lastUpdated).toLocaleDateString()} at ${new Date(usageData.lastUpdated).toLocaleTimeString()}`
              ) : (
                "Please sign in to view usage"
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
