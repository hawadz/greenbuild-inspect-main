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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl bg-gradient-pastel p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/70 grid place-items-center text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Panduan Survei</h1>
            <p className="text-sm text-foreground/70">Petunjuk teknis tata cara pemeriksaan kondisi bangunan.</p>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-8 rounded-2xl shadow-card">
        <h2 className="font-bold text-lg">Alur Pemeriksaan</h2>
        <ol className="mt-6 space-y-5">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <div className="shrink-0 h-9 w-9 rounded-full bg-secondary grid place-items-center font-bold text-primary text-sm">
                {i + 1}
              </div>
              <div className="pb-5 border-b last:border-0 last:pb-0 flex-1">
                <div className="font-semibold">{s.t}</div>
                <p className="text-sm text-muted-foreground mt-0.5">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { i: CheckCircle2, t: "Akurat", d: "Gunakan alat ukur terkalibrasi." , c: "text-emerald-600" },
          { i: Camera, t: "Terdokumentasi", d: "Setiap kerusakan wajib disertai foto.", c: "text-primary" },
          { i: Ruler, t: "Konsisten", d: "Satuan volume mengikuti komponen.", c: "text-teal-600" },
        ].map(({ i: Icon, t, d, c }) => (
          <Card key={t} className="p-5 rounded-xl shadow-card">
            <Icon className={`h-5 w-5 ${c}`} />
            <div className="mt-3 font-semibold">{t}</div>
            <p className="text-xs text-muted-foreground mt-1">{d}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5 rounded-xl border-warning bg-warning/30">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-warning-foreground">
            <strong>Catatan:</strong> Untuk kerusakan dengan tingkat “Rusak Berat”, segera laporkan kepada pihak berwenang dan
            lakukan pembatasan akses pada area terdampak.
          </div>
        </div>
      </Card>
    </div>
  );
}
