import {LayoutDashboard, ClipboardList, FileText, History, Car} from "lucide-react";
import { useEffect, useState } from "react";

interface TabProps {
  currentPath: string;
}

export default function DashboardTabs({ currentPath }: TabProps) {
  const tabs = [
    { label: "Início", path: "/dashboard", icon: LayoutDashboard },
    { label: "Meus Veículos", path: "/dashboard/meus-veiculos", icon: Car},
    { label: "Pedidos", path: "/dashboard/pedidos", icon: ClipboardList },
    { label: "Contratos", path: "/dashboard/contratos", icon: FileText },
    { label: "Histórico", path: "/dashboard/history", icon: History },
  ];

  return (
    <div className="flex items-center gap-1 bg-bg-card/40 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-700/50 mb-10 w-fit">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        const Icon = tab.icon;
        
        return (
          <a
            key={tab.path}
            href={tab.path}
            className={`
              flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${isActive 
                ? "bg-primary text-black shadow-lg shadow-primary/20" 
                : "text-text-main/60 hover:text-text-main hover:bg-white/5"
              }
            `}
          >
            <Icon size={18} />
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
