import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoginView } from "@/components/app/LoginView";
import { AppShell } from "@/components/app/AppShell";
import { BerandaView } from "@/components/app/views/BerandaView";
import { PanduanView } from "@/components/app/views/PanduanView";
import { SurveiView } from "@/components/app/views/SurveiView";
import { LaporanView } from "@/components/app/views/LaporanView";
// 1. IMPORT VIEW BARU DI SINI
import { BukuPedomanView } from "@/components/app/views/BukuPedomanView"; 

// 2. TAMBAHKAN "buku-pedoman" KE DALAM NavKey
export type NavKey = "beranda" | "panduan" | "survei" | "laporan" | "buku-pedoman";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIPPKBG — Pemeriksaan Kerusakan Bangunan Gedung" },
      { name: "description", content: "Aplikasi pemeriksaan dan penanganan kerusakan bangunan gedung dengan dashboard surveyor modern." },
    ],
  }),
  component: Index,
});

function Index() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [active, setActive] = useState<NavKey>("beranda");

  if (!user) return <LoginView onLogin={(u) => setUser(u)} />;

  return (
    <AppShell active={active} onNavigate={setActive} user={user} onLogout={() => setUser(null)}>
      {active === "beranda" && <BerandaView onNavigate={setActive} />}
      {active === "panduan" && <PanduanView />}
      {active === "survei" && <SurveiView />}
      {active === "laporan" && <LaporanView />}
      {/* 3. RENDER VIEW BARU DI SINI */}
      {active === "buku-pedoman" && <BukuPedomanView />} 
    </AppShell>
  );
}