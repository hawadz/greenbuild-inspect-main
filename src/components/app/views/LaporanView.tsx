import { Fragment, useState } from "react";
import { Download, ChevronDown, ChevronRight, Search, Filter, Wrench, FileDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  owner: string;
  score: number;
  recommendation: string;
  detail: string;
};

const DATA: Row[] = [
  { id: "B-001", name: "Gedung Serbaguna Cipayung", owner: "Pemkot Jakarta Timur", score: 22, recommendation: "Pemeliharaan Berkala", detail: "Retak rambut pada plafond beberapa ruangan, cat dinding mengelupas <10%." },
  { id: "B-002", name: "SDN 03 Bekasi Utara", owner: "Dinas Pendidikan Bekasi", score: 38, recommendation: "Rehabilitasi Sedang", detail: "Atap bocor 3 titik, kusen kayu lapuk, instalasi listrik perlu pembaruan parsial." },
  { id: "B-003", name: "Puskesmas Pondok Aren", owner: "Dinkes Tangerang Selatan", score: 51, recommendation: "Injeksi Epoxy + Rehabilitasi Berat", detail: "Retak struktural pada kolom lt.2, plumbing bocor, atap rapuh." },
  { id: "B-004", name: "Kantor Lurah Sukatani", owner: "Pemkot Depok", score: 18, recommendation: "Perawatan Ringan", detail: "Hanya pengecatan ulang dan penggantian beberapa keramik." },
  { id: "B-005", name: "Pasar Tradisional Cinere", owner: "PD Pasar Jaya", score: 47, recommendation: "Injeksi Epoxy", detail: "Retak struktural pada balok utama, korosi tulangan pada beberapa kolom." },
  { id: "B-006", name: "Balai Warga Pancoran Mas", owner: "Pemkot Depok", score: 29, recommendation: "Pemeliharaan Berkala", detail: "Plafond bocor minor, pintu rusak ringan." },
];

function categorize(score: number) {
  if (score <= 30) return { label: "Rusak Ringan", cls: "bg-success text-success-foreground" };
  if (score <= 45) return { label: "Rusak Sedang", cls: "bg-warning text-warning-foreground" };
  return { label: "Rusak Berat", cls: "bg-danger text-danger-foreground" };
}

export function LaporanView() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = DATA.filter(
    (r) => r.name.toLowerCase().includes(query.toLowerCase()) ||
           r.owner.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Hasil & Laporan</h1>
          <p className="text-sm text-muted-foreground mt-1">Ringkasan inspeksi seluruh bangunan tercatat.</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground shadow-lift">
          <Download className="h-4 w-4 mr-2" /> Export Semua
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Bangunan", v: DATA.length, cls: "text-primary" },
          { l: "Rusak Ringan", v: DATA.filter((r) => r.score <= 30).length, cls: "text-emerald-600" },
          { l: "Rusak Sedang", v: DATA.filter((r) => r.score > 30 && r.score <= 45).length, cls: "text-amber-600" },
          { l: "Rusak Berat", v: DATA.filter((r) => r.score > 45).length, cls: "text-rose-600" },
        ].map((s) => (
          <Card key={s.l} className="p-5 rounded-xl shadow-card">
            <div className="text-xs text-muted-foreground font-medium">{s.l}</div>
            <div className={`mt-2 text-2xl font-extrabold ${s.cls}`}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-wrap gap-3 items-center border-b">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari bangunan atau pemilik…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1.5" /> Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8 px-3 py-3"></th>
                <th className="text-left font-semibold px-3 py-3">Nama Bangunan</th>
                <th className="text-left font-semibold px-3 py-3">Pemilik</th>
                <th className="text-left font-semibold px-3 py-3">Bobot</th>
                <th className="text-left font-semibold px-3 py-3">Tingkat Kerusakan</th>
                <th className="text-right font-semibold px-3 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const c = categorize(r.score);
                const isOpen = open === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className="border-t hover:bg-muted/30 transition">
                      <td className="px-3 py-3">
                        <button onClick={() => setOpen(isOpen ? null : r.id)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted">
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-semibold">{r.name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{r.owner}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                r.score <= 30 ? "bg-emerald-500" : r.score <= 45 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(100, r.score * 1.5)}%` }}
                            />
                          </div>
                          <span className="font-semibold">{r.score}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge className={`${c.cls} hover:opacity-90 rounded-md font-semibold`}>{c.label}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => setOpen(isOpen ? null : r.id)}>Detail</Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`PDF ${r.id} diunduh`)} title="Download PDF">
                          <FileDown className="h-4 w-4 text-primary" />
                        </Button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-secondary/30 border-t">
                        <td></td>
                        <td colSpan={5} className="px-3 py-4">
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="rounded-lg bg-card p-4 border">
                              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Rekomendasi</div>
                              <div className="mt-1.5 font-semibold flex items-center gap-2 text-primary">
                                <Wrench className="h-4 w-4" /> {r.recommendation}
                              </div>
                            </div>
                            <div className="sm:col-span-2 rounded-lg bg-card p-4 border">
                              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Catatan Inspeksi</div>
                              <p className="mt-1.5 text-sm text-foreground/80">{r.detail}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-sm text-muted-foreground">Tidak ada hasil.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
