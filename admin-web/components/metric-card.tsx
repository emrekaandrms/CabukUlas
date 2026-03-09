import { ReactNode } from "react";
import clsx from "clsx";

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
  return (
    <div className={clsx("metricCard", tone)}>
      <div className="metricHeader">
        <span className="metricTitle">{title}</span>
        {icon ? <span className="metricIcon">{icon}</span> : null}
      </div>
      <div className="metricValue">{value}</div>
      {hint ? <p className="metricHint">{hint}</p> : null}
    </div>
  );
}
