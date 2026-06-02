import { BookOpen, ClipboardPlus, ArrowUpRight, TrendingUp, Building2, ShieldCheck } from "lucide-react";
import type { NavKey } from "@/routes/index";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recent = [
  { name: "Gedung Serbaguna Kec. Cipayung", owner: "Pemkot Jakarta Timur", score: 22, level: "Ringan" },
  { name: "Sekolah Dasar Negeri 03 Bekasi", owner: "Dinas Pendidikan", score: 38, level: "Sedang" },
  { name: "Puskesmas Pondok Aren", owner: "Dinkes Tangerang", score: 51, level: "Berat" },
  { name: "Kantor Lurah Sukatani", owner: "Pemkot Depok", score: 18, level: "Ringan" },
];

const badgeFor = (l: string) =>
  l === "Ringan" ? "bg-success text-success-foreground" :
  l === "Sedang" ? "bg-warning text-warning-foreground" :
  "bg-danger text-danger-foreground";

export function BerandaView({ onNavigate }: { onNavigate: (k: NavKey) => void }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-pastel p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-20">
          <Building2 className="h-56 w-56 text-foreground" />
        </div>
        <div className="relative">
          <Badge className="bg-white/70 text-primary hover:bg-white/70">
            <ShieldCheck className="h-3 w-3 mr-1" /> Surveyor Aktif
          </Badge>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Selamat datang kembali 👋
          </h1>
          <p className="mt-1 text-sm sm:text-base text-foreground/70 max-w-2xl">
            Lanjutkan inspeksi bangunan Anda atau mulai survei baru. Semua data tercatat aman dan terstruktur.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Survei", v: "248", d: "+12 minggu ini", c: "text-primary" },
          { l: "Rusak Ringan", v: "156", d: "62.9%", c: "text-emerald-600" },
          { l: "Rusak Sedang", v: "62", d: "25.0%", c: "text-amber-600" },
          { l: "Rusak Berat", v: "30", d: "12.1%", c: "text-rose-600" },
        ].map((s) => (
          <Card key={s.l} className="p-5 rounded-xl shadow-card border-border/60">
            <div className="text-xs text-muted-foreground font-medium">{s.l}</div>
            <div className={`mt-2 text-2xl font-extrabold ${s.c}`}>{s.v}</div>
            <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {s.d}
            </div>
          </Card>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <ActionCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Panduan Survei"
          desc="Baca petunjuk teknis tata cara pemeriksaan kondisi bangunan."
          cta="Buka Panduan"
          onClick={() => onNavigate("panduan")}
        />
        <ActionCard
          icon={<ClipboardPlus className="h-6 w-6" />}
          title="Mulai Survei"
          desc="Mulai pencatatan data kerusakan gedung baru."
          cta="Mulai Sekarang"
          highlight
          onClick={() => onNavigate("survei")}
        />
      </div>

      {/* Recent table */}
      <Card className="rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b">
          <div>
            <h3 className="font-bold">Hasil Survei Terakhir</h3>
            <p className="text-xs text-muted-foreground mt-0.5">4 inspeksi terbaru</p>
          </div>
          <button onClick={() => onNavigate("laporan")} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
            Lihat semua <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-6 py-3">Bangunan</th>
                <th className="text-left font-semibold px-6 py-3">Pemilik</th>
                <th className="text-left font-semibold px-6 py-3">Bobot</th>
                <th className="text-left font-semibold px-6 py-3">Tingkat</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.name} className="border-t hover:bg-muted/30 transition">
                  <td className="px-6 py-3.5 font-medium">{r.name}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{r.owner}</td>
                  <td className="px-6 py-3.5 font-semibold">{r.score}%</td>
                  <td className="px-6 py-3.5">
                    <Badge className={`${badgeFor(r.level)} hover:opacity-90 rounded-md font-semibold`}>
                      Rusak {r.level}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ActionCard({
  icon, title, desc, cta, onClick, highlight,
}: { icon: React.ReactNode; title: string; desc: string; cta: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={[
        "group text-left rounded-2xl p-6 sm:p-7 border transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lift",
        highlight ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-card hover:border-primary/30",
      ].join(" ")}
    >
      <div className={`h-12 w-12 rounded-xl grid place-items-center ${
        highlight ? "bg-white/20 text-primary-foreground" : "bg-secondary text-primary"
      }`}>
        {icon}
      </div>
      <h3 className={`mt-4 text-lg font-bold ${highlight ? "" : "text-foreground"}`}>{title}</h3>
      <p className={`mt-1 text-sm ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{desc}</p>
      <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
        highlight ? "text-primary-foreground" : "text-primary"
      } group-hover:gap-2.5 transition-all`}>
        {cta} <ArrowUpRight className="h-4 w-4" />
      </div>
    </button>
  );
}
