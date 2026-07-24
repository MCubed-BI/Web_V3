"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const subtabs = [
  { label: "Overview", href: "/open-order-dash/overview", disabled: true },
  { label: "Pipeline", href: "/open-order-dash/pipeline", disabled: true },
  { label: "Backorders", href: "/open-order-dash/backorders", disabled: true },
  { label: "Fulfillment", href: "/open-order-dash/fulfillment", disabled: true },
];
export default function OpenOrderDashLayout({ children }) {
  const pathname = usePathname();
  return (
    <div className="dashboard-content">
      <div className="subtab-bar">
        {subtabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className={`subtab ${pathname === tab.href ? "active" : ""} ${tab.disabled ? "disabled" : ""}`}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}