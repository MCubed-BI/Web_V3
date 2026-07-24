"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const subtabs = [
  { label: "Overview", href: "/gl-dash/overview" },
  { label: "Journal Entries", href: "/gl-dash/journal-entries", disabled: true },
  { label: "Trial Balance", href: "/gl-dash/trial-balance", disabled: true },
  { label: "Variance", href: "/gl-dash/variance", disabled: true },
];
export default function GLDashLayout({ children }) {
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