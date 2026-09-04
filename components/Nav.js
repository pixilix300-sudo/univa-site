"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/acheter", label: "Acheter", color: "#5B8CFF" },
  { href: "/vendre", label: "Vendre", color: "#2DD4C6" },
  { href: "/compte", label: "Compte", color: "#9C8CFF" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
      <div
        className="w-full max-w-md flex"
        style={{
          backgroundColor: "rgba(13,17,28,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid #242C42",
        }}
      >
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium"
              style={{ color: active ? item.color : "#525E7D" }}
            >
              {item.label}
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: active ? item.color : "transparent" }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
