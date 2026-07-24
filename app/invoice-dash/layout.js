"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const subtabs = [
  { label: "Overview", href: "/invoice-dash/overview" },
  { label: "Detail", href: "/invoice-dash/detail" },
  { label: "Trends", href: "/invoice-dash/trends" },
  { label: "Top Products", href: "/invoice-dash/top-products" },
  { label: "Bottom Products", href: "/invoice-dash/bottom-products" },
  { label: "State Breakdown", href: "/invoice-dash/state-breakdown" },
  { label: "Ship Via", href: "/invoice-dash/ship-via" },
  { label: "Aging", href: "/invoice-dash/aging" },
];

export default function InvoiceDashLayout({ children }) {
  const pathname = usePathname();
  return (
    <div className="dashboard-content">
      <div className="subtab-bar">
        {subtabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`subtab ${pathname === tab.href ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="page-body">{children}</div>
    </div>
  );
}