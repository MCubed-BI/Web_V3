"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const subtabs = [
  { label: "AR Summary", href: "/ar-ap-dash/ar-summary", disabled: true },
  { label: "AP Summary", href: "/ar-ap-dash/ap-summary", disabled: true },
  { label: "Aging", href: "/ar-ap-dash/aging", disabled: true },
  { label: "Cash Flow", href: "/ar-ap-dash/cash-flow", disabled: true },
];
export default function ARAPDashLayout({ children }) {
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