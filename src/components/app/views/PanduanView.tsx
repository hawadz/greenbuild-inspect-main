import { BookOpen, CheckCircle2, AlertTriangle, Camera, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  { t: "Persiapan Survei", d: "Pelajari struktur bangunan, kumpulkan dokumen IMB, gambar as-built dan riwayat pemeliharaan." },
  { t: "Pencatatan Data Umum", d: "Catat identitas bangunan: nama, tahun, fungsi, klasifikasi, jumlah lantai, dan luas." },
  { t: "Inspeksi Komponen", d: "Periksa empat kategori pekerjaan: Struktur, Non-Struktur, Utilitas, dan Finishing." },
  { t: "Dokumentasi Visual", d: "Unggah foto kerusakan untuk setiap komponen sebagai bukti pendukung." },
  { t: "Penilaian Bobot", d: "Sistem akan menghitung bobot kerusakan secara otomatis berdasarkan volume." },
  { t: "Rekomendasi", d: "Terima rekomendasi penanganan: perawatan ringan, rehabilitasi, atau injeksi epoxy." },
];

export function PanduanView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header dengan tema Gemini Blue */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-6 sm:p-8 shadow-sm border border-blue-100/50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/80 shadow-sm backdrop-blur-sm grid place-items-center text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950">Panduan Survei</h1>
            <p className="text-sm text-indigo-900/70 font-medium mt-0.5">Petunjuk teknis tata cara pemeriksaan kondisi bangunan.</p>
          </div>
        </div>
      </div>

      {/* Card Utama Alur Pemeriksaan */}
      <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100/50">
        <h2 className="font-bold text-lg text-indigo-950">Alur Pemeriksaan</h2>
        <ol className="mt-6 space-y-5">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <div className="shrink-0 h-9 w-9 rounded-full bg-blue-100 grid place-items-center font-bold text-blue-700 text-sm">
                {i + 1}
              </div>
              <div className="pb-5 border-b border-slate-100 last:border-0 last:pb-0 flex-1">
                <div className="font-bold text-slate-800">{s.t}</div>
                <p className="text-sm text-slate-500 mt-0.5">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Grid Card 3 Kolom */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { i: CheckCircle2, t: "Akurat", d: "Gunakan alat ukur terkalibrasi." , c: "text-emerald-600" },
          { i: Camera, t: "Terdokumentasi", d: "Setiap kerusakan wajib disertai foto.", c: "text-blue-600" },
          { i: Ruler, t: "Konsisten", d: "Satuan volume mengikuti komponen.", c: "text-indigo-600" },
        ].map(({ i: Icon, t, d, c }) => (
          <Card key={t} className="p-5 rounded-2xl shadow-sm border border-blue-100/50">
            <Icon className={`h-6 w-6 ${c}`} />
            <div className="mt-3 font-bold text-slate-800">{t}</div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d}</p>
          </Card>
        ))}
      </div>

      {/* Warning Card (Menggunakan warna Amber/Kuning standar yang lebih elegan) */}
      <Card className="p-5 rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 leading-relaxed">
            <strong className="text-amber-900">Catatan:</strong> Untuk kerusakan dengan tingkat “Rusak Berat”, segera laporkan kepada pihak berwenang dan
            lakukan pembatasan akses pada area terdampak.
          </div>
        </div>
      </Card>
    </div>
  );
}