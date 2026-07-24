"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const subtabs = [
  { label: "Overview", href: "/warehouse-dash/overview", disabled: true },
  { label: "Activity", href: "/warehouse-dash/activity", disabled: true },
  { label: "Transfers", href: "/warehouse-dash/transfers", disabled: true },
  { label: "Productivity", href: "/warehouse-dash/productivity", disabled: true },
];
export default function WarehouseDashLayout({ children }) {
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