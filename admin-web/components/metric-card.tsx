import { ReactNode } from "react";
import clsx from "clsx";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
  icon?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  hint,
  tone = "default",
  icon,
}: MetricCardProps) {
  const toneVariant =
    tone === "success" ? "success" : tone === "warning" ? "warning" : tone === "danger" ? "danger" : "outline";

  return (
    <Card className={clsx("metricCard", tone)}>
      <CardContent className="p-5">
        <div className="metricHeader">
        <span className="metricTitle">{title}</span>
        {icon ? <span className="metricIcon">{icon}</span> : null}
        </div>
        <div className="metricValue">{value}</div>
        {hint ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={toneVariant}>{title}</Badge>
            <p className="metricHint">{hint}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
