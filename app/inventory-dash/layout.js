"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const subtabs = [
  { label: "Overview", href: "/inventory-dash/overview", disabled: true },
  { label: "On-Hand", href: "/inventory-dash/on-hand", disabled: true },
  { label: "Turns", href: "/inventory-dash/turns", disabled: true },
  { label: "Valuation", href: "/inventory-dash/valuation", disabled: true },
];
export default function InventoryDashLayout({ children }) {
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