import type { ReactNode } from "react";
import { Building2, Home, BookOpen, ClipboardPlus, FileBarChart2, Search, Bell, LogOut, ChevronDown } from "lucide-react";
import type { NavKey } from "@/routes/index";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: "beranda", label: "Beranda", icon: Home },
  { key: "panduan", label: "Panduan Survei", icon: BookOpen },
  { key: "survei", label: "Mulai Survei", icon: ClipboardPlus },
  { key: "laporan", label: "Hasil Laporan", icon: FileBarChart2 },
];

const TITLES: Record<NavKey, string> = {
  beranda: "Beranda",
  panduan: "Panduan Survei",
  survei: "Mulai Survei",
  laporan: "Hasil & Laporan",
};

type Props = {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
  user: { email: string; role: string };
  onLogout: () => void;
  children: ReactNode;
};

export function AppShell({ active, onNavigate, user, onLogout, children }: Props) {
  const initials = user.email.slice(0, 2).toUpperCase();
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 px-5 h-16 border-b">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-lift">
            <Building2 className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm tracking-tight">SIPPKBG</div>
            <div className="text-[10px] text-muted-foreground">Inspeksi Bangunan</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Menu</div>
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={[
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                ].join(" ")}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                <span>{label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="m-3 p-4 rounded-xl bg-gradient-pastel text-foreground">
          <div className="text-xs font-semibold">Butuh bantuan?</div>
          <p className="text-[11px] mt-1 text-foreground/70">Hubungi tim teknis untuk panduan inspeksi lanjutan.</p>
          <button className="mt-3 text-xs font-semibold text-primary hover:underline">Hubungi Support →</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs text-muted-foreground">Halaman</div>
            <div className="text-sm font-semibold">{TITLES[active]}</div>
          </div>
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari bangunan, pemilik, atau laporan…" className="pl-9 h-10 bg-background" />
            </div>
          </div>
          <button className="relative h-10 w-10 grid place-items-center rounded-lg hover:bg-muted transition">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-muted transition">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold truncate max-w-[120px]">{user.email}</div>
                <div className="text-[10px] text-muted-foreground">{user.role}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden border-b bg-card overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap ${
                  active === key ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
