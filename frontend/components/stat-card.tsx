import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, colorClass }: StatCardProps) {
  return (
    <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${colorClass || ""}`}>{value}</p>
              {trend && (
                <span className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div
            className={`h-12 w-12 rounded-lg ${colorClass ? "bg-primary/10" : "bg-muted"} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${colorClass || "text-muted-foreground"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
