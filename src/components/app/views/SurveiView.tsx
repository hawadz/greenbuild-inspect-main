import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Upload, Plus, Trash2, Check, Save, Image as ImageIcon, Layers, Info, CalendarCheck, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

// --- TYPE DATA ---
type DamageRow = {
  id: string;
  kode: string;
  komponen: string;
  lantai: string;
  material: string;
  jenis: string;
  jenisLainnya: string;
  volumeTotal: string;
  panjang: string; 
  lebar: string;   
  tinggi: string;  
  volumeKerusakan: string;
  satuan: string;
  foto: string | null;
  kategoriKey: string;
};

type IdentitasGedung = {
  namaBangunan: string;
  tahunDibangun: string;
  jumlahTingkat: string;
  luasTotal: string;
  luasBasement: string;
  fungsi: string;
  fungsiLainnya: string;
  klasifikasi: string;
  namaPemilik: string;
  alamat: string;
  catatan: string;
  asBuiltDrawing: string | null;
  tanggalMulai: string;   
  tanggalSelesai: string; 
};

// --- DATA REFERENSI ---
const REKOMENDASI_MAP: Record<string, string> = {
  "Pondasi_Deformasi/Turun": `Rekomendasi Penanganan:
Bangunan gedung yang mengalami rusak ringan dan sedang, direkomendasikan untuk dilakukan rehabilitasi. 

Berikut adalah beberapa metode efektif untuk memperbaiki pondasi yang turun:
a. Underpinning (Perkuatan Pondasi)
- Beton Baru : Memperdalam atau memperlebar pondasi.
- Tiang Baja/Piling : Menggunakan alat hidrolik untuk menstabilkan pondasi.`,
  "default": "Silakan merujuk pada Buku Pedoman Pemeriksaan dan Penanganan Kerusakan Bangunan Gedung untuk rekomendasi detail.",
};

const MATERIAL_OPTIONS = ["Beton Bertulang", "Baja", "Baja Ringan", "Kayu", "Batu Bata", "Lainnya"];

// DAFTAR KOMPONEN YANG DI-GENERATE PER LANTAI (Sesuai request)
const PER_LANTAI_COMPONENTS = [
  "Kolom", "Balok dan Pelat", "Plesteran Struktur", 
  "Rangka Langit-Langit", "Penutup Langit-Langit", 
  "Dinding Batu Bata/Partisi", "Dinding Plesteran", "Penutup Lantai", 
  "Finishing Struktur (Cat)", "Finishing Langit-Langit (Cat)", 
  "Finishing Dinding", "Finishing Pintu/Kusen (Cat)"
];

const CATEGORIES = [
  {
    key: "struktur",
    label: "Pekerjaan Struktur",
    color: "bg-blue-100 text-blue-700 border-blue-200", // Diubah ke tema biru
    components: [
      { name: "Pondasi", unit: "m³", jenisKerusakan: ["Deformasi/Turun", "Retak", "Bocor", "Rapuh", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Kolom", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Balok dan Pelat", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah/Remuk", "Bocor", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Plesteran Struktur", unit: "m²", jenisKerusakan: ["Retak rambut", "Pengelupasan dan Pelepasan", "Penggelambungan", "Pengkristalan Garam", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Rangka Atap", unit: "m²", jenisKerusakan: ["Melengkung", "Rusak/Patah", "Bocor", "Retak", "Korosi/Rapuh", "Sambungan lepas", "Tidak ada kerusakan", "Lainnya"] },
    ],
  },
  {
    key: "non-struktur",
    label: "Pekerjaan Non-Struktur",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200", // Diubah ke tema biru
    components: [
      { name: "Penutup Atap", unit: "m²", jenisKerusakan: ["Retak", "Pecah", "Rembes", "Bocor", "Korosi", "Berlumut/Berjamur", "Ditumbuhi tanaman", "Paku lepas", "Flashing rusak", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Rangka Langit-Langit", unit: "m²", jenisKerusakan: ["Pelapukan pada rangka kayu", "Korosi pada rangka metal", "Rusak pada sambungan", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Penutup Langit-Langit", unit: "m²", jenisKerusakan: ["Kerusakan panil plafon", "Kotor/Berbecak", "Pudar", "Panil lepas", "Panil longgar", "Panil hilang", "Panil melengkung", "Panil retak", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Dinding Batu Bata/Partisi", unit: "m²", jenisKerusakan: ["Melengkung/Cembung", "Retak", "Adukan lepas", "Turun/Runtuh", "Mencuat", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Dinding Plesteran", unit: "m²", jenisKerusakan: ["Retak rambut", "Celah", "Pengapuran", "Bocor", "Lapisan luar lepas/Terkelupas", "Lembab", "Berlumut/berjamur", "Ditumbuhi tanaman", "Terkikis", "Kotor", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Kaca", unit: "m²", jenisKerusakan: ["Retak", "Kondensasi", "Goresan atau Jamur", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Pintu", unit: "unit", jenisKerusakan: ["Berlubang", "Patah", "Rusak", "Sambungan lepas", "Melengkung", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Kusen", unit: "m¹", jenisKerusakan: ["Lapuk termakan usia", "Rapuh/Keropos", "Retak", "Pudar", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Penutup Lantai", unit: "m²", jenisKerusakan: ["Retak", "Remuk", "Kerusakan pada sambungan", "Lepas", "Hilang", "Rusak", "Berbercak/Pudar", "Pecah/Patah", "Tidak ada kerusakan", "Lainnya"] },
    ],
  },
  {
    key: "utilitas",
    label: "Pekerjaan Utilitas",
    color: "bg-sky-100 text-sky-700 border-sky-200", // Diubah ke tema biru
    components: [
      { name: "Instalasi Listrik", unit: "titik", jenisKerusakan: ["Kabel/insulasi terbakar", "Korosi", "Label hilang/tidak tepat", "Kapasitas tidak cukup", "Sambungan longgar", "Ruang bebas", "Titik panas", "Air/uap air", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Instalasi Air", unit: "m¹", jenisKerusakan: ["Tekanan air", "Korosi", "Insulasi rusak", "Penahan pipa", "Katup bocor", "Pipa bocor", "Pembuangan air lambat", "Bercak", "Retak", "Tersumbat", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Drainase Limbah", unit: "m¹", jenisKerusakan: ["Retak", "Bergelombang", "Amblas", "Ada bagian yang rusak", "Terkelupas", "Turun", "Pecah", "Tidak ada kerusakan", "Lainnya"] },
    ],
  },
  {
    key: "finishing",
    label: "Finishing",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200", // Diubah ke tema biru
    components: [
      { name: "Finishing Struktur (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Finishing Langit-Langit (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Finishing Dinding", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan", "Lainnya"] },
      { name: "Finishing Pintu/Kusen (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan", "Lainnya"] },
    ],
  },
];

const STEPS = [
  { id: 1, label: "Data Umum", short: "Umum" },
  { id: 2, label: "Struktur", short: "STR" },
  { id: 3, label: "Non-Struktur", short: "N-STR" },
  { id: 4, label: "Utilitas", short: "UTL" },
  { id: 5, label: "Finishing", short: "FIN" },
];

export function SurveiView() {
  const [step, setStep] = useState(1);
  const totalSteps = STEPS.length;

  const [identitas, setIdentitas] = useState<IdentitasGedung>({
    namaBangunan: "", tahunDibangun: "", jumlahTingkat: "", luasTotal: "", luasBasement: "", 
    fungsi: "", fungsiLainnya: "", klasifikasi: "", namaPemilik: "", alamat: "", catatan: "", asBuiltDrawing: null,
    tanggalMulai: "", tanggalSelesai: ""
  });

  const [rows, setRows] = useState<DamageRow[]>([]);

  const simpanDraf = () => {
    const drafData = { identitas, rows, lastStep: step };
    localStorage.setItem("survei_draf", JSON.stringify(drafData));
    toast.success("Draf berhasil disimpan! Anda bisa melanjutkannya nanti.");
  };

  const simpanKeBackend = async () => {
    if (!identitas.namaBangunan) {
      toast.error("Nama Bangunan tidak boleh kosong!");
      setStep(1);
      return;
    }

    const finalIdentitas = {
      ...identitas,
      fungsi: identitas.fungsi === "Lainnya" ? identitas.fungsiLainnya : identitas.fungsi,
    };
    const finalRows = rows.map(r => ({
      ...r,
      jenis: r.jenis === "Lainnya" ? r.jenisLainnya : r.jenis,
      material: r.material === "Lainnya" ? r.jenisLainnya : r.material 
    }));

    const paketData = { identitas: finalIdentitas, dataKerusakan: finalRows };

    try {
      toast.loading("Sedang mengirim data ke server...");
      const respons = await axios.post("http://localhost:3000/api/simpan-survei", paketData);
      
      if (respons.data.status === 'sukses') {
        toast.dismiss();
        toast.success("Laporan Survei berhasil dikirim!");
        localStorage.removeItem("survei_draf");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal menyimpan data! Pastikan backend Node.js sudah menyala.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Inspeksi Lapangan
          </h1>
          <p className="text-sm text-indigo-900/70 mt-1 font-medium">Lengkapi data kerusakan secara bertahap.</p>
        </div>
        <Button variant="outline" onClick={simpanDraf} className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm">
          <Save className="h-4 w-4" /> Simpan Draf
        </Button>
      </div>

      {/* Stepper dengan tema biru */}
      <Card className="p-4 rounded-2xl shadow-sm border-blue-100/60 bg-white">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer" onClick={() => setStep(s.id)}>
              <div className={`h-8 w-8 rounded-full grid place-items-center font-bold text-xs transition-all ${
                step >= s.id 
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-100" 
                  : "bg-slate-100 text-slate-400"
              }`}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <div className={`text-[10px] font-bold text-center whitespace-nowrap ${step === s.id ? "text-indigo-950" : "text-slate-400"}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="min-h-[50vh]">
        {step === 1 && <Step1 identitas={identitas} setIdentitas={setIdentitas} />}
        {step === 2 && <StepKerusakan category={CATEGORIES[0]} rows={rows} setRows={setRows} identitas={identitas} />}
        {step === 3 && <StepKerusakan category={CATEGORIES[1]} rows={rows} setRows={setRows} identitas={identitas} />}
        {step === 4 && <StepKerusakan category={CATEGORIES[2]} rows={rows} setRows={setRows} identitas={identitas} />}
        {step === 5 && <StepKerusakan category={CATEGORIES[3]} rows={rows} setRows={setRows} identitas={identitas} />}
      </div>

      {step === totalSteps && (
        <Card className="p-6 mt-6 rounded-2xl shadow-sm border border-emerald-200 bg-emerald-50/50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-800 text-lg">Penyelesaian Survei</h3>
              <p className="text-sm text-emerald-700/80 mb-4 font-medium">Pastikan seluruh komponen bangunan telah diperiksa dengan saksama sebelum mengakhiri inspeksi.</p>
              <div className="max-w-sm space-y-2">
                <Label className="text-emerald-900 font-bold">Tanggal Selesai Survei</Label>
                <Input 
                  type="date" 
                  value={identitas.tanggalSelesai} 
                  onChange={(e) => setIdentitas({ ...identitas, tanggalSelesai: e.target.value })} 
                  className="bg-white border-emerald-200 focus-visible:ring-emerald-500 shadow-sm" 
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)} className="border-slate-200 text-slate-600 shadow-sm">
          <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
        </Button>
        {step < totalSteps ? (
          <Button onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={simpanKeBackend} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            <Check className="h-4 w-4 mr-1" /> Selesai & Kirim Laporan
          </Button>
        )}
      </div>
    </div>
  );
}

// --- KOMPONEN STEP 1 (DATA UMUM) ---
function Step1({ identitas, setIdentitas }: { identitas: IdentitasGedung, setIdentitas: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof IdentitasGedung, value: string) => {
    setIdentitas((prev: IdentitasGedung) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdfOrJpg = file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/png";
      if (!isPdfOrJpg) {
        toast.error("Hanya file PDF atau JPG/PNG yang diperbolehkan.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("asBuiltDrawing", reader.result as string);
        toast.success("Dokumen berhasil diunggah!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100/60 bg-white space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-indigo-950">Data Umum Gedung</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">Isi informasi dasar bangunan yang akan diinspeksi.</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2"><Label className="text-slate-700">Tanggal Mulai Survei</Label><Input type="date" value={identitas.tanggalMulai} onChange={(e) => handleChange("tanggalMulai", e.target.value)} className="shadow-sm" /></div>
        <div className="space-y-2"><Label className="text-slate-700">Nama Bangunan</Label><Input value={identitas.namaBangunan} onChange={(e) => handleChange("namaBangunan", e.target.value)} placeholder="Mis. Gedung Serbaguna A" className="shadow-sm" /></div>
        <div className="space-y-2"><Label className="text-slate-700">Nama Pemilik / Instansi</Label><Input value={identitas.namaPemilik} onChange={(e) => handleChange("namaPemilik", e.target.value)} placeholder="Pemilik Gedung" className="shadow-sm" /></div>
        
        <div className="sm:col-span-2 lg:col-span-3 space-y-2"><Label className="text-slate-700">Alamat Lengkap</Label><Input value={identitas.alamat} onChange={(e) => handleChange("alamat", e.target.value)} placeholder="Jl. Raya..." className="shadow-sm" /></div>
        
        <div className="space-y-2"><Label className="text-slate-700">Tahun Dibangun</Label><Input type="number" value={identitas.tahunDibangun} onChange={(e) => handleChange("tahunDibangun", e.target.value)} placeholder="2010" className="shadow-sm" /></div>
        <div className="space-y-2"><Label className="text-slate-700">Jumlah Tingkat (Lantai)</Label><Input type="number" value={identitas.jumlahTingkat} onChange={(e) => handleChange("jumlahTingkat", e.target.value)} placeholder="3" className="shadow-sm" /></div>
        <div className="space-y-2"><Label className="text-slate-700">Luas Total Lantai (m²)</Label><Input type="number" value={identitas.luasTotal} onChange={(e) => handleChange("luasTotal", e.target.value)} placeholder="1200" className="shadow-sm" /></div>
        
        <div className="space-y-2"><Label className="text-slate-700">Luas Lantai Basement (m²)</Label><Input type="number" value={identitas.luasBasement} onChange={(e) => handleChange("luasBasement", e.target.value)} placeholder="0" className="shadow-sm" /></div>
        
        <div className="space-y-2">
          <Label className="text-slate-700">Fungsi Bangunan</Label>
          <Select value={identitas.fungsi} onValueChange={(v) => handleChange("fungsi", v)}>
            <SelectTrigger className="shadow-sm"><SelectValue placeholder="Pilih fungsi" /></SelectTrigger>
            <SelectContent>
              {["Fungsi Hunian", "Fungsi Keagamaan", "Fungsi Usaha", "Fungsi Sosial Budaya", "Fungsi Khusus", "Fungsi Ganda/Campuran", "Lainnya"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {identitas.fungsi === "Lainnya" && (
            <Input className="mt-2 shadow-sm" placeholder="Sebutkan fungsi lainnya..." value={identitas.fungsiLainnya} onChange={(e) => handleChange("fungsiLainnya", e.target.value)} />
          )}
        </div>

        <div className="space-y-2"><Label className="text-slate-700">Klasifikasi Bangunan</Label>
          <Select value={identitas.klasifikasi} onValueChange={(v) => handleChange("klasifikasi", v)}>
            <SelectTrigger className="shadow-sm"><SelectValue placeholder="Pilih klasifikasi" /></SelectTrigger>
            <SelectContent>
              {["Sederhana", "Tidak Sederhana", "Khusus"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <Label className="block mb-2 text-slate-700">Gambar Bangunan / As-Built Drawing (PDF/JPG)</Label>
        <div className="flex items-center gap-4">
          <input type="file" accept=".pdf, image/jpeg, image/png" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()} className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm">
            <Upload className="h-4 w-4" /> Pilih File
          </Button>
          {identitas.asBuiltDrawing && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><Check className="h-4 w-4" /> File terunggah</span>}
        </div>
      </div>

      <div>
        <Label className="block mb-2 text-slate-700">Catatan Tambahan</Label>
        <Textarea value={identitas.catatan} onChange={(e) => handleChange("catatan", e.target.value)} placeholder="Kondisi lingkungan sekitar..." rows={3} className="shadow-sm" />
      </div>
    </Card>
  );
}

// --- KOMPONEN STEP KERUSAKAN ---
function StepKerusakan({ category, rows, setRows, identitas }: { category: (typeof CATEGORIES)[number], rows: DamageRow[], setRows: any, identitas: IdentitasGedung }) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold flex items-center gap-2 text-indigo-950">
          <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${category.color}`}>
            {category.key}
          </span>
          {category.label}
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Isi Lokasi/Lantai, Material, dan Detail Kerusakan.</p>
      </div>
      {category.components.map((comp) => (
        <ComponentTable key={comp.name} component={comp} categoryKey={category.key} rows={rows} setRows={setRows} identitas={identitas} />
      ))}
    </div>
  );
}

// --- TABEL PER KOMPONEN ---
function ComponentTable({ component, categoryKey, rows, setRows, identitas }: { component: any, categoryKey: string, rows: DamageRow[], setRows: any, identitas: IdentitasGedung }) {
  const isPerLantai = PER_LANTAI_COMPONENTS.includes(component.name);

  const [jmlGen, setJmlGen] = useState<string>(""); 
  const [jmlPerLantai, setJmlPerLantai] = useState<string>("");
  const [jmlLantai, setJmlLantai] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const componentRows = rows.filter(r => r.komponen === component.name);
  const getPrefix = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase();

  // Sinkronisasi otomatis ke "Jumlah Tingkat" dari Data Umum jika kosong
  useEffect(() => {
    if (isPerLantai && identitas.jumlahTingkat && !jmlLantai) {
      setJmlLantai(identitas.jumlahTingkat);
    }
  }, [identitas.jumlahTingkat, isPerLantai, jmlLantai]);

  const handleGenerate = () => {
    const existingCount = componentRows.length;
    const prefix = getPrefix(component.name);
    let newRows: DamageRow[] = [];

    if (isPerLantai) {
      const cPerLantai = parseInt(jmlPerLantai);
      const cLantai = parseInt(jmlLantai);
      if (isNaN(cPerLantai) || isNaN(cLantai) || cPerLantai <= 0 || cLantai <= 0) return;

      let globalIndex = 1;
      for (let l = 1; l <= cLantai; l++) {
        for (let i = 1; i <= cPerLantai; i++) {
          newRows.push({
            id: crypto.randomUUID(),
            kategoriKey: categoryKey,
            kode: `${prefix}${existingCount + globalIndex}`,
            komponen: component.name,
            lantai: `Lt. ${l}`,   
            material: "",
            jenis: component.jenisKerusakan[0],
            jenisLainnya: "",
            volumeTotal: "", panjang: "", lebar: "", tinggi: "", volumeKerusakan: "",
            satuan: component.unit,
            foto: null
          });
          globalIndex++;
        }
      }
      setJmlPerLantai("");
    } else {
      const count = parseInt(jmlGen);
      if (isNaN(count) || count <= 0) return;

      for (let i = 1; i <= count; i++) {
        newRows.push({
          id: crypto.randomUUID(),
          kategoriKey: categoryKey,
          kode: `${prefix}${existingCount + i}`,
          komponen: component.name,
          lantai: "",
          material: "",
          jenis: component.jenisKerusakan[0],
          jenisLainnya: "",
          volumeTotal: "", panjang: "", lebar: "", tinggi: "", volumeKerusakan: "",
          satuan: component.unit,
          foto: null
        });
      }
      setJmlGen(""); 
    }

    setRows((prev: DamageRow[]) => [...prev, ...newRows]);
    toast.success(`Baris ${component.name} berhasil ditambahkan!`);
  };

  const update = (id: string, patch: Partial<DamageRow>) => {
    setRows((r: DamageRow[]) => r.map((row) => {
      if (row.id !== id) return row;
      const updatedRow = { ...row, ...patch };
      
      if (patch.panjang !== undefined || patch.lebar !== undefined || patch.tinggi !== undefined) {
        const p = parseFloat(updatedRow.panjang) || 1;
        const l = parseFloat(updatedRow.lebar) || 1;
        const t = parseFloat(updatedRow.tinggi) || 1;
        
        let vol = 0;
        if (updatedRow.satuan === 'm³') vol = p * l * t;
        else if (updatedRow.satuan === 'm²') vol = p * l;
        else if (updatedRow.satuan === 'm¹') vol = p;
        else vol = p;

        if (updatedRow.panjang || updatedRow.lebar || updatedRow.tinggi) {
          updatedRow.volumeKerusakan = vol.toFixed(2);
        }
      }
      return updatedRow;
    }));
  };

  const removeRow = (id: string) => setRows((r: DamageRow[]) => r.filter((row) => row.id !== id));
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeRowId) {
      const reader = new FileReader();
      reader.onloadend = () => { update(activeRowId, { foto: reader.result as string }); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm border-blue-100/60 overflow-hidden bg-white mb-6">
      <div className="bg-sky-50/50 border-b border-blue-100/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-base text-indigo-950">{component.name}</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {isPerLantai ? (
            <>
              <Label className="text-xs font-bold text-slate-500 whitespace-nowrap">Auto Gen (Per Lt):</Label>
              <Input type="number" placeholder="Jml/Lt" className="h-8 w-16 text-center border-blue-200" value={jmlPerLantai} onChange={(e) => setJmlPerLantai(e.target.value)} />
              <span className="text-slate-400 text-xs font-bold">x</span>
              <Input type="number" placeholder="Lantai" className="h-8 w-16 text-center border-blue-200" value={jmlLantai} onChange={(e) => setJmlLantai(e.target.value)} />
              <Button size="sm" onClick={handleGenerate} className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Label className="text-xs font-bold text-slate-500 whitespace-nowrap">Auto Generate:</Label>
              <Input type="number" placeholder="Jml" className="h-8 w-16 text-center border-blue-200" value={jmlGen} onChange={(e) => setJmlGen(e.target.value)} />
              <Button size="sm" onClick={handleGenerate} className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-3 py-3 text-center w-20 font-bold">Kode</th>
              <th className="px-3 py-3 text-left w-32 font-bold">Lokasi / Lantai</th>
              <th className="px-3 py-3 text-left w-40 font-bold">Material</th>
              <th className="px-3 py-3 text-left w-56 font-bold">Jenis Kerusakan</th>
              <th className="px-3 py-3 text-center w-48 font-bold">Dimensi (P x L x T)</th>
              <th className="px-3 py-3 text-center w-24 font-bold">Vol Total</th>
              <th className="px-3 py-3 text-center w-24 font-bold">Vol Rusak</th>
              <th className="px-3 py-3 text-center w-16 font-bold">Sat.</th>
              <th className="px-3 py-3 text-right w-24 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {componentRows.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-400 font-medium">Belum ada data. Masukkan jumlah dan klik (+) Generate.</td></tr>
            ) : (
              componentRows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-2 py-2">
                    <Input value={row.kode} onChange={(e) => update(row.id, { kode: e.target.value })} className="h-8 font-mono font-bold text-slate-600 bg-white text-center px-1 border-slate-200" />
                  </td>
                  <td className="px-2 py-2">
                    <Input value={row.lantai} onChange={(e) => update(row.id, { lantai: e.target.value })} placeholder="Mis: Lt. 1" className="h-8 bg-white px-2 border-slate-200" />
                  </td>
                  <td className="px-2 py-2">
                     <Select value={row.material} onValueChange={(v) => update(row.id, { material: v })}>
                        <SelectTrigger className="h-8 bg-white px-2 border-slate-200"><SelectValue placeholder="Pilih..."/></SelectTrigger>
                        <SelectContent>
                          {MATERIAL_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-start gap-1">
                      <div className="flex-1">
                        <Select value={row.jenis} onValueChange={(v) => update(row.id, { jenis: v })}>
                          <SelectTrigger className="h-8 bg-white px-2 text-xs border-slate-200"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {component.jenisKerusakan.map((j: string) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {row.jenis === "Lainnya" && (
                          <Input placeholder="Sebutkan..." value={row.jenisLainnya} onChange={(e) => update(row.id, { jenisLainnya: e.target.value })} className="h-7 mt-1 text-xs bg-white border-slate-200" />
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100 shrink-0 mt-0.5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-lg flex items-center gap-2 text-indigo-950">
                              <Info className="h-5 w-5 text-blue-600" />
                              Penanganan: {component.name} - {row.jenis === "Lainnya" ? row.jenisLainnya : row.jenis}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-600 bg-sky-50/50 p-5 rounded-xl border border-blue-100">
                            {REKOMENDASI_MAP[`${component.name}_${row.jenis}`] || REKOMENDASI_MAP["default"]}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <Input type="number" placeholder="P" className="h-8 w-12 px-1 text-center border-slate-200" value={row.panjang} onChange={(e) => update(row.id, {panjang: e.target.value})} disabled={row.satuan === 'unit' || row.satuan === 'titik'}/>
                      <span className="text-slate-400 text-[10px] font-bold">x</span>
                      <Input type="number" placeholder="L" className="h-8 w-12 px-1 text-center border-slate-200" value={row.lebar} onChange={(e) => update(row.id, {lebar: e.target.value})} disabled={row.satuan === 'm¹' || row.satuan === 'unit' || row.satuan === 'titik'}/>
                      <span className="text-slate-400 text-[10px] font-bold">x</span>
                      <Input type="number" placeholder="T" className="h-8 w-12 px-1 text-center border-slate-200" value={row.tinggi} onChange={(e) => update(row.id, {tinggi: e.target.value})} disabled={row.satuan === 'm²' || row.satuan === 'm¹' || row.satuan === 'unit' || row.satuan === 'titik'}/>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Input type="number" placeholder="0" className="h-8 text-center bg-white px-1 border-slate-200" value={row.volumeTotal} onChange={(e) => update(row.id, {volumeTotal: e.target.value})} />
                  </td>
                  <td className="px-2 py-2">
                    <Input type="number" placeholder="0" className="h-8 text-center border-emerald-300 bg-emerald-50 text-emerald-800 font-bold px-1" value={row.volumeKerusakan} onChange={(e) => update(row.id, {volumeKerusakan: e.target.value})} />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{row.satuan}</span>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.foto ? (
                        <div className="relative group rounded-md border border-slate-200 overflow-hidden h-8 w-8 cursor-pointer shadow-sm" onClick={() => update(row.id, { foto: null })} title="Hapus Foto">
                          <img src={row.foto} alt="Bukti" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3 w-3 text-white" /></div>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Unggah Foto" onClick={() => { setActiveRowId(row.id); fileInputRef.current?.click(); }}>
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeRow(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}