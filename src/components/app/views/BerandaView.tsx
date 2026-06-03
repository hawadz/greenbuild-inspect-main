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

// Semantic color tetap dipertahankan untuk status kerusakan agar informatif
const badgeFor = (l: string) =>
  l === "Ringan" ? "bg-emerald-100 text-emerald-700 border-none" :
  l === "Sedang" ? "bg-amber-100 text-amber-700 border-none" :
  "bg-rose-100 text-rose-700 border-none";

export function BerandaView({ onNavigate }: { onNavigate: (k: NavKey) => void }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner - Tema Gemini Pastel */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-6 sm:p-8 shadow-sm border border-blue-100/50 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-[0.07]">
          <Building2 className="h-56 w-56 text-indigo-900" />
        </div>
        <div className="relative">
          <Badge className="bg-white/80 text-blue-700 hover:bg-white border-blue-200 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3 mr-1 text-blue-600" /> Surveyor Aktif
          </Badge>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-950">
            Selamat datang kembali 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-900/70 max-w-2xl font-medium">
            Lanjutkan inspeksi bangunan Anda atau mulai survei baru. Semua data tercatat aman dan terstruktur.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Survei", v: "248", d: "+12 minggu ini", c: "text-blue-600" },
          { l: "Rusak Ringan", v: "156", d: "62.9%", c: "text-emerald-600" },
          { l: "Rusak Sedang", v: "62", d: "25.0%", c: "text-amber-600" },
          { l: "Rusak Berat", v: "30", d: "12.1%", c: "text-rose-600" },
        ].map((s) => (
          <Card key={s.l} className="p-5 rounded-xl shadow-sm border-slate-200/60 hover:shadow-md transition-shadow">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.l}</div>
            <div className={`mt-2 text-3xl font-extrabold ${s.c}`}>{s.v}</div>
            <div className="mt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
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
      <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Hasil Survei Terakhir</h3>
            <p className="text-xs text-slate-500 mt-0.5">4 inspeksi terbaru</p>
          </div>
          <button onClick={() => onNavigate("laporan")} className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1">
            Lihat semua <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-xs uppercase tracking-wider text-slate-400 border-b">
              <tr>
                <th className="font-semibold px-6 py-4">Bangunan</th>
                <th className="font-semibold px-6 py-4">Pemilik</th>
                <th className="font-semibold px-6 py-4">Bobot</th>
                <th className="font-semibold px-6 py-4">Tingkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((r) => (
                <tr key={r.name} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{r.name}</td>
                  <td className="px-6 py-4 text-slate-500">{r.owner}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{r.score}%</td>
                  <td className="px-6 py-4">
                    <Badge className={`${badgeFor(r.level)} px-2.5 py-0.5 rounded-md font-semibold shadow-none`}>
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
        "hover:-translate-y-1 hover:shadow-lg",
        // Logika warna untuk Action Card (Highlight = Gemini Dark Blue, Normal = White dengan sentuhan Blue)
        highlight 
          ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-transparent shadow-md" 
          : "bg-white hover:border-blue-300 border-slate-200 shadow-sm",
      ].join(" ")}
    >
      <div className={`h-12 w-12 rounded-xl grid place-items-center transition-colors ${
        highlight 
          ? "bg-white/20 text-white group-hover:bg-white/30" 
          : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
      }`}>
        {icon}
      </div>
      <h3 className={`mt-5 text-lg font-bold ${highlight ? "text-white" : "text-slate-800"}`}>{title}</h3>
      <p className={`mt-1.5 text-sm leading-relaxed ${highlight ? "text-blue-100" : "text-slate-500"}`}>{desc}</p>
      <div className={`mt-6 inline-flex items-center gap-1.5 text-sm font-bold ${
        highlight ? "text-white" : "text-blue-600"
      } group-hover:gap-2.5 transition-all`}>
        {cta} <ArrowUpRight className="h-4 w-4" />
      </div>
    </button>
  );
}