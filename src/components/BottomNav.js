"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Sparkles, BookOpen, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Search", path: "/discover", icon: Search },
    { name: "Genie", path: "/discover", icon: Sparkles },
    { name: "Orders", path: "/dashboard/orders", icon: BookOpen },
    { name: "Profile", path: "/dashboard", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#ffffff]/70 backdrop-blur-2xl border-t border-[#ccc3d8]/15 z-50 rounded-t-[3rem] shadow-[0px_-10px_40px_rgba(28,27,34,0.06)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
        
        return (
          <Link 
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center rounded-full px-4 py-2 active:scale-90 transition-all duration-300 ${
              isActive 
                ? "bg-[#7c3aed]/10 text-[#630ed4]" 
                : "text-[#4a4455] hover:bg-[#f7f2fc]"
            }`}
          >
            <Icon className="w-6 h-6" fill={isActive ? "currentColor" : "none"} />
            <span className="font-['Inter'] text-[10px] font-medium mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
