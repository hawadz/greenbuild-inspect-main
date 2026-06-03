import { Fragment, useState, useEffect } from "react";
import { 
  Download, ChevronDown, ChevronRight, Search, Filter, Wrench, FileDown, 
  ArrowLeft, Printer, Share2, Building2, MapPin, CheckCircle2, FileText
} from "lucide-react";
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
  raw_data?: any;
};

const DUMMY_DATA: Row[] = [
  { id: "B-001", name: "Gedung Serbaguna Cipayung", owner: "Pemkot Jakarta Timur", score: 22, recommendation: "Pemeliharaan Berkala", detail: "Retak rambut pada plafond beberapa ruangan, cat dinding mengelupas <10%." },
  { id: "B-002", name: "SDN 03 Bekasi Utara", owner: "Dinas Pendidikan Bekasi", score: 38, recommendation: "Rehabilitasi Sedang", detail: "Atap bocor 3 titik, kusen kayu lapuk, instalasi listrik perlu pembaruan parsial." },
  { id: "B-003", name: "Puskesmas Pondok Aren", owner: "Dinkes Tangerang Selatan", score: 51, recommendation: "Injeksi Epoxy + Rehabilitasi Berat", detail: "Retak struktural pada kolom lt.2, plumbing bocor, atap rapuh." },
];

// Menggunakan nuansa pastel yang selaras dengan Beranda untuk kategori
function categorize(score: number) {
  if (score <= 30) return { label: "Rusak Ringan", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score <= 45) return { label: "Rusak Sedang", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Rusak Berat", cls: "bg-rose-50 text-rose-700 border-rose-200" };
}

export function LaporanView() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  
  const [dataLaporan, setDataLaporan] = useState<Row[]>(DUMMY_DATA);
  const [selectedReport, setSelectedReport] = useState<Row | null>(null);
  const [viewMode, setViewMode] = useState<"web" | "pdf">("web");

  useEffect(() => {
    const savedSurvei = localStorage.getItem("survei_draf");
    if (savedSurvei) {
      const parsed = JSON.parse(savedSurvei);
      const totalVolRusak = parsed.rows.reduce((sum: number, r: any) => sum + (parseFloat(r.volumeKerusakan) || 0), 0);
      const fakeScore = Math.min(100, Math.max(10, totalVolRusak * 2)); 

      const realData: Row = {
        id: "SRV-NEW",
        name: parsed.identitas.namaBangunan || "Bangunan Baru",
        owner: parsed.identitas.namaPemilik || "Belum ada pemilik",
        score: fakeScore,
        recommendation: fakeScore > 45 ? "Rehabilitasi Berat" : "Pemeliharaan Berkala",
        detail: parsed.identitas.catatan || "Data hasil survei terbaru dari inspeksi lapangan.",
        raw_data: parsed 
      };
      
      setDataLaporan([realData, ...DUMMY_DATA]);
    }
  }, []);

  const filtered = dataLaporan.filter(
    (r) => r.name.toLowerCase().includes(query.toLowerCase()) ||
           r.owner.toLowerCase().includes(query.toLowerCase())
  );

  const handleShare = () => {
    const fakeUrl = `${window.location.origin}/laporan/${selectedReport?.id}`;
    navigator.clipboard.writeText(fakeUrl);
    toast.success("Link laporan web berhasil disalin!");
  };

  // -------------------------------------------------------------
  // MODE 3: PREVIEW PDF (Hitam Putih Resmi - Tidak Diubah Warnanya)
  // -------------------------------------------------------------
  if (selectedReport && viewMode === "pdf") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm sticky top-20 z-10">
          <Button variant="ghost" onClick={() => setViewMode("web")} className="gap-2 text-indigo-800 hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Tampilan Web
          </Button>
          <Button onClick={() => window.print()} className="gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md hover:shadow-lg transition-all">
            <Printer className="h-4 w-4" /> Cetak / Download PDF
          </Button>
        </div>

        <div className="bg-white p-8 sm:p-12 border rounded-xl shadow-sm print:shadow-none print:border-none print:p-0">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <Building2 className="h-10 w-10 mx-auto mb-2 text-slate-800" />
            <h1 className="text-2xl font-bold uppercase tracking-wide">Laporan Inspeksi Bangunan</h1>
            <p className="text-sm mt-1 text-muted-foreground">Sistem Informasi Pemeriksaan & Penanganan Kerusakan</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <table className="w-full text-left">
              <tbody>
                <tr><th className="w-32 py-1">ID Laporan</th><td>: {selectedReport.id}</td></tr>
                <tr><th className="w-32 py-1">Nama Gedung</th><td className="font-bold">: {selectedReport.name}</td></tr>
                <tr><th className="w-32 py-1">Pemilik</th><td>: {selectedReport.owner}</td></tr>
              </tbody>
            </table>
            <table className="w-full text-left">
              <tbody>
                <tr><th className="w-32 py-1">Status</th><td>: Selesai Diinspeksi</td></tr>
                <tr>
                  <th className="w-32 py-1">Tingkat Rusak</th>
                  <td className="font-bold text-lg">
                    : <span className="uppercase">{categorize(selectedReport.score).label} ({selectedReport.score}%)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 border-l-4 border-black pl-2">Rekomendasi Penanganan Utama</h2>
            <div className="p-4 border border-black rounded-sm text-sm">
              <span className="font-bold">{selectedReport.recommendation}</span>
              <p className="mt-2">{selectedReport.detail}</p>
            </div>
          </div>

          {selectedReport.raw_data && (
             <div className="mt-8 print:break-before-page">
               <h2 className="font-bold mb-2 border-l-4 border-black pl-2">Lampiran: Rincian Temuan Kerusakan</h2>
               <table className="w-full border-collapse border border-black text-xs">
                 <thead className="bg-slate-100 font-semibold text-center">
                   <tr>
                     <th className="border border-black p-2 w-12">Kode</th>
                     <th className="border border-black p-2">Komponen</th>
                     <th className="border border-black p-2">Jenis Kerusakan</th>
                     <th className="border border-black p-2 w-24">Vol Rusak</th>
                     <th className="border border-black p-2 w-24">Foto</th>
                   </tr>
                 </thead>
                 <tbody>
                   {selectedReport.raw_data.rows.map((row: any) => (
                     <tr key={row.id}>
                       <td className="border border-black p-2 text-center font-bold">{row.kode}</td>
                       <td className="border border-black p-2">{row.komponen}</td>
                       <td className="border border-black p-2">{row.jenis}</td>
                       <td className="border border-black p-2 text-center font-bold">{row.volumeKerusakan} {row.satuan}</td>
                       <td className="border border-black p-1 text-center">
                         {row.foto ? <img src={row.foto} alt="Bukti" className="h-12 w-full object-cover rounded-sm" /> : "-"}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 2: TAMPILAN DETAIL WEB (Modern & Selaras Tema)
  // -------------------------------------------------------------
  if (selectedReport && viewMode === "web") {
    const c = categorize(selectedReport.score);
    
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)} className="rounded-full bg-white hover:bg-blue-100 text-blue-700 shadow-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-indigo-950">{selectedReport.name}</h1>
              <p className="text-sm text-indigo-900/70 flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3" /> Laporan Inspeksi Lapangan
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2 bg-white text-blue-700 border-blue-200 hover:bg-blue-50 shadow-sm">
              <Share2 className="h-4 w-4" /> Bagikan Link
            </Button>
            <Button onClick={() => setViewMode("pdf")} className="gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md hover:shadow-lg transition-all">
              <FileText className="h-4 w-4" /> Preview & Cetak PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl shadow-sm border-blue-100/50 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full border-8 border-slate-100 flex items-center justify-center mb-4 relative overflow-hidden bg-white">
                <div 
                  className={`absolute bottom-0 w-full opacity-20 ${selectedReport.score <= 30 ? "bg-emerald-500" : selectedReport.score <= 45 ? "bg-amber-500" : "bg-rose-500"}`} 
                  style={{ height: `${selectedReport.score}%` }} 
                />
                <span className="text-3xl font-extrabold z-10 text-slate-800">{selectedReport.score}%</span>
              </div>
              <h3 className="font-bold text-slate-600 mb-2">Tingkat Kerusakan</h3>
              <Badge className={`${c.cls} px-3 py-1 text-sm rounded-lg border font-semibold shadow-sm`}>{c.label}</Badge>
            </Card>

            <Card className="p-6 rounded-2xl shadow-sm border-blue-100/50 space-y-4">
              <h3 className="font-bold border-b border-blue-100 pb-2 text-indigo-900">Rekomendasi Utama</h3>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{selectedReport.recommendation}</div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{selectedReport.detail}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 rounded-2xl shadow-sm border-blue-100/50">
              <h3 className="font-bold border-b border-blue-100 pb-2 mb-4 text-indigo-900">Informasi Gedung</h3>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div><span className="text-slate-400 block text-xs font-semibold mb-1">ID Laporan</span><span className="font-bold text-slate-700">{selectedReport.id}</span></div>
                <div><span className="text-slate-400 block text-xs font-semibold mb-1">Pemilik / Instansi</span><span className="font-bold text-slate-700">{selectedReport.owner}</span></div>
                <div><span className="text-slate-400 block text-xs font-semibold mb-1">Status Inspeksi</span><span className="font-bold flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4"/> Selesai</span></div>
                
                {selectedReport.raw_data && (
                  <>
                    <div><span className="text-slate-400 block text-xs font-semibold mb-1">Fungsi Bangunan</span><span className="font-bold text-slate-700">{selectedReport.raw_data.identitas.fungsi || "-"}</span></div>
                    <div><span className="text-slate-400 block text-xs font-semibold mb-1">Tahun Dibangun</span><span className="font-bold text-slate-700">{selectedReport.raw_data.identitas.tahunDibangun || "-"}</span></div>
                    <div className="sm:col-span-2"><span className="text-slate-400 block text-xs font-semibold mb-1">Alamat Lengkap</span><span className="font-bold text-slate-700">{selectedReport.raw_data.identitas.alamat || "-"}</span></div>
                  </>
                )}
              </div>
            </Card>

            {selectedReport.raw_data && (
              <Card className="rounded-2xl shadow-sm border-blue-100/50 overflow-hidden">
                <div className="p-5 border-b border-blue-100 bg-sky-50/50">
                  <h3 className="font-bold text-indigo-900">Rincian Temuan Kerusakan</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Kode</th>
                        <th className="px-4 py-3 font-semibold">Komponen</th>
                        <th className="px-4 py-3 font-semibold">Volume Rusak</th>
                        <th className="px-4 py-3 font-semibold text-center">Foto Bukti</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReport.raw_data.rows.map((row: any) => (
                        <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-xs text-slate-500">{row.kode}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-700">{row.komponen}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{row.jenis}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-bold bg-white text-slate-600 shadow-sm">{row.volumeKerusakan} {row.satuan}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {row.foto ? (
                              <img src={row.foto} alt="Bukti" className="h-12 w-20 object-cover rounded-md mx-auto shadow-sm border border-slate-200" />
                            ) : (
                              <span className="text-slate-300 text-xs italic">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 1: DASHBOARD UTAMA (Tabel Daftar Laporan)
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950">Hasil & Laporan</h1>
          <p className="text-sm text-indigo-900/70 mt-1 font-medium">Ringkasan inspeksi seluruh bangunan tercatat.</p>
        </div>
        <Button className="bg-white text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-50">
          <Download className="h-4 w-4 mr-2" /> Export Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Bangunan", v: dataLaporan.length, cls: "text-blue-600" },
          { l: "Rusak Ringan", v: dataLaporan.filter((r) => r.score <= 30).length, cls: "text-emerald-600" },
          { l: "Rusak Sedang", v: dataLaporan.filter((r) => r.score > 30 && r.score <= 45).length, cls: "text-amber-600" },
          { l: "Rusak Berat", v: dataLaporan.filter((r) => r.score > 45).length, cls: "text-rose-600" },
        ].map((s) => (
          <Card key={s.l} className="p-5 rounded-xl shadow-sm border-blue-100/50 hover:shadow-md transition-shadow">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.l}</div>
            <div className={`mt-2 text-3xl font-extrabold ${s.cls}`}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm border-blue-100/50 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-wrap gap-3 items-center border-b border-blue-100 bg-sky-50/30">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input placeholder="Cari bangunan atau pemilik…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 bg-white border-blue-100 focus-visible:ring-blue-500" />
          </div>
          <Button variant="outline" size="sm" className="bg-white border-blue-100 text-blue-700 hover:bg-blue-50">
            <Filter className="h-4 w-4 mr-1.5" /> Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
              <tr>
                <th className="w-8 px-3 py-4"></th>
                <th className="text-left font-semibold px-3 py-4">Nama Bangunan</th>
                <th className="text-left font-semibold px-3 py-4">Pemilik</th>
                <th className="text-left font-semibold px-3 py-4 w-48">Tingkat Kerusakan</th>
                <th className="text-left font-semibold px-3 py-4 w-32">Status</th>
                <th className="text-right font-semibold px-3 py-4 w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                const c = categorize(r.score);
                const isOpen = open === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-3 py-4 text-center">
                        <button onClick={() => setOpen(isOpen ? null : r.id)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-blue-100 transition-colors text-blue-600">
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-4 font-bold text-slate-700">{r.name}</td>
                      <td className="px-3 py-4 text-slate-500 font-medium">{r.owner}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.score <= 30 ? "bg-emerald-500" : r.score <= 45 ? "bg-amber-500" : "bg-rose-500"}`}
                              style={{ width: `${Math.min(100, r.score * 1.5)}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs text-slate-600">{r.score}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <Badge className={`${c.cls} border font-bold px-2 py-0.5 rounded-md shadow-sm`}>{c.label}</Badge>
                      </td>
                      <td className="px-3 py-4 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => setOpen(isOpen ? null : r.id)} className="text-slate-500 hover:text-blue-700 hover:bg-blue-50">Ringkasan</Button>
                        <Button size="sm" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-none border border-blue-200" onClick={() => { setSelectedReport(r); setViewMode("web"); }}>
                          Buka Laporan
                        </Button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-sky-50/30">
                        <td></td>
                        <td colSpan={5} className="px-3 py-4">
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-sm">
                              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Rekomendasi</div>
                              <div className="font-bold flex items-start gap-2 text-blue-700 text-sm">
                                <Wrench className="h-4 w-4 mt-0.5 shrink-0" /> {r.recommendation}
                              </div>
                            </div>
                            <div className="sm:col-span-2 rounded-xl bg-white p-4 border border-blue-100 shadow-sm">
                              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Catatan Inspeksi</div>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">{r.detail}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-sm text-slate-400 font-medium">Tidak ada hasil pencarian.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}