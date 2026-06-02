// src/components/app/views/SurveiView.tsx

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Upload, Camera, Plus, Trash2, Check, Save, Image as ImageIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// --- TAMBAHAN IMPORT BARU MULAI DI SINI ---
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Layers } from "lucide-react";
// --- TAMBAHAN IMPORT BARU SELESAI ---
import { toast } from "sonner";
import axios from "axios";

// --- TYPE DATA ---
type DamageRow = {
  id: string;
  kode: string; // Tambahan: P1, K1, dll
  komponen: string;
  jenis: string;
  volumeTotal: string;
  panjang: string; // Tambahan dimensi
  lebar: string;   // Tambahan dimensi
  tinggi: string;  // Tambahan dimensi
  volumeKerusakan: string;
  satuan: string;
  foto: string | null;
  kategoriKey: string; // Untuk memfilter berdasarkan step
};

type IdentitasGedung = {
  namaBangunan: string;
  tahunDibangun: string;
  jumlahTingkat: string;
  luasTotal: string;
  luasBasement: string;
  fungsi: string;
  klasifikasi: string;
  namaPemilik: string;
  alamat: string;
  catatan: string;
  asBuiltDrawing: string | null; // Tambahan: As-Built Drawing
};

// --- DATA REFERENSI ---
const CATEGORIES = [
  {
    key: "struktur",
    label: "Pekerjaan Struktur",
    color: "bg-emerald-100 text-emerald-700",
    components: [
      { name: "Pondasi", unit: "m³", jenisKerusakan: ["Deformasi/Turun", "Retak", "Bocor", "Rapuh", "Tidak ada kerusakan"] },
      { name: "Kolom", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah", "Tidak ada kerusakan"] },
      { name: "Balok dan Pelat", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah/Remuk", "Bocor", "Tidak ada kerusakan"] },
      { name: "Plesteran Struktur", unit: "m²", jenisKerusakan: ["Retak rambut", "Pengelupasan dan Pelepasan", "Penggelambungan", "Pengkristalan Garam", "Tidak ada kerusakan"] },
      { name: "Rangka Atap", unit: "m²", jenisKerusakan: ["Melengkung", "Rusak/Patah", "Bocor", "Retak", "Korosi/Rapuh", "Sambungan lepas", "Tidak ada kerusakan"] },
    ],
  },
  {
    key: "non-struktur",
    label: "Pekerjaan Non-Struktur",
    color: "bg-teal-100 text-teal-700",
    components: [
      { name: "Penutup Atap", unit: "m²", jenisKerusakan: ["Retak", "Pecah", "Rembes", "Bocor", "Korosi", "Berlumut/Berjamur", "Ditumbuhi tanaman", "Paku lepas", "Flashing rusak", "Tidak ada kerusakan"] },
      { name: "Rangka Langit-Langit", unit: "m²", jenisKerusakan: ["Pelapukan pada rangka kayu", "Korosi pada rangka metal", "Rusak pada sambungan", "Tidak ada kerusakan"] },
      { name: "Penutup Langit-Langit", unit: "m²", jenisKerusakan: ["Kerusakan panil plafon", "Kotor/Berbecak", "Pudar", "Panil lepas", "Panil longgar", "Panil hilang", "Panil melengkung", "Panil retak", "Tidak ada kerusakan"] },
      { name: "Dinding Batu Bata/Partisi", unit: "m²", jenisKerusakan: ["Melengkung/Cembung", "Retak", "Adukan lepas", "Turun/Runtuh", "Mencuat", "Tidak ada kerusakan"] },
      { name: "Dinding Plesteran", unit: "m²", jenisKerusakan: ["Retak rambut", "Celah", "Pengapuran", "Bocor", "Lapisan luar lepas/Terkelupas", "Lembab", "Berlumut/berjamur", "Ditumbuhi tanaman", "Terkikis", "Kotor", "Tidak ada kerusakan"] },
      { name: "Kaca", unit: "m²", jenisKerusakan: ["Retak", "Kondensasi", "Goresan atau Jamur", "Tidak ada kerusakan"] },
      { name: "Pintu", unit: "unit", jenisKerusakan: ["Berlubang", "Patah", "Rusak", "Sambungan lepas", "Melengkung", "Tidak ada kerusakan"] },
      { name: "Kusen", unit: "m¹", jenisKerusakan: ["Lapuk termakan usia", "Rapuh/Keropos", "Retak", "Pudar", "Tidak ada kerusakan"] },
      { name: "Penutup Lantai", unit: "m²", jenisKerusakan: ["Retak", "Remuk", "Kerusakan pada sambungan", "Lepas", "Hilang", "Rusak", "Berbercak/Pudar", "Pecah/Patah", "Tidak ada kerusakan"] },
    ],
  },
  {
    key: "utilitas",
    label: "Pekerjaan Utilitas",
    color: "bg-sky-100 text-sky-700",
    components: [
      { name: "Instalasi Listrik", unit: "titik", jenisKerusakan: ["Kabel/insulasi terbakar", "Korosi", "Label hilang/tidak tepat", "Kapasitas tidak cukup", "Sambungan longgar", "Ruang bebas", "Titik panas", "Air/uap air", "Tidak ada kerusakan"] },
      { name: "Instalasi Air", unit: "m¹", jenisKerusakan: ["Tekanan air", "Korosi", "Insulasi rusak", "Penahan pipa", "Katup bocor", "Pipa bocor", "Pembuangan air lambat", "Bercak", "Retak", "Tersumbat", "Tidak ada kerusakan"] },
      { name: "Drainase Limbah", unit: "m¹", jenisKerusakan: ["Retak", "Bergelombang", "Amblas", "Ada bagian yang rusak", "Terkelupas", "Turun", "Pecah", "Tidak ada kerusakan"] },
    ],
  },
  {
    key: "finishing",
    label: "Finishing",
    color: "bg-amber-100 text-amber-700",
    components: [
      { name: "Finishing Struktur (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan"] },
      { name: "Finishing Langit-Langit (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan"] },
      { name: "Finishing Dinding", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan"] },
      { name: "Finishing Pintu/Kusen (Cat)", unit: "m²", jenisKerusakan: ["Perubahan Warna", "Retak", "Berlumut", "Lepas", "Tidak ada kerusakan"] },
    ],
  },
];

// Definisi Steps
const STEPS = [
  { id: 1, label: "Data Umum", short: "Umum" },
  { id: 2, label: "Struktur", short: "STR" },
  { id: 3, label: "Non-Struktur", short: "N-STR" },
  { id: 4, label: "Utilitas", short: "UTL" },
  { id: 5, label: "Finishing", short: "FIN" },
];

// --- TAMBAHAN KODE REKOMENDASI MULAI DI SINI ---
const REKOMENDASI_MAP: Record<string, string> = {
  "Pondasi_Deformasi/Turun": `Rekomendasi Penanganan:
Bangunan gedung yang mengalami rusak ringan dan sedang, direkomendasikan untuk dilakukan rehabilitasi. 

Berikut adalah beberapa metode efektif untuk memperbaiki pondasi yang turun :
a. Underpinning (Perkuatan Pondasi)
Underpinning adalah teknik yang paling umum digunakan untuk memperkuat pondasi yang sudah ada dengan menambahkan elemen struktural baru di bawahnya.
- Beton Baru : Memperdalam atau memperlebar pondasi dengan beton baru untuk mencapai lapisan tanah yang lebih padat/keras.
- Tiang Baja/Piling (Push Piers) : Menggunakan alat hidrolik untuk mendorong tiang baja ke dalam tanah hingga mencapai tanah atau batuan dasar yang stabil, kemudian mengikatnya ke pondasi untuk mengangkat dan menstabilkannya.`,
  // Nanti Anda bisa copy-paste dari PDF untuk komponen lainnya di sini
  "default": "Silakan merujuk pada Buku Pedoman Pemeriksaan dan Penanganan Kerusakan Bangunan Gedung untuk rekomendasi detail.",
};

export function SurveiView() {

  const [step, setStep] = useState(1);
  const totalSteps = STEPS.length;

  const [identitas, setIdentitas] = useState<IdentitasGedung>({
    namaBangunan: "", tahunDibangun: "", jumlahTingkat: "", luasTotal: "",
    luasBasement: "", fungsi: "", klasifikasi: "", namaPemilik: "", alamat: "", catatan: "", asBuiltDrawing: null
  });

  const [rows, setRows] = useState<DamageRow[]>([]);

  // --- FUNGSI SIMPAN DRAF ---
  const simpanDraf = () => {
    // Simpan ke Local Storage untuk sementara
    const drafData = { identitas, rows, lastStep: step };
    localStorage.setItem("survei_draf", JSON.stringify(drafData));
    toast.success("Draf berhasil disimpan! Anda bisa melanjutkannya nanti.");
  };

  // --- FUNGSI KIRIM FINAL ---
  const simpanKeBackend = async () => {
    if (!identitas.namaBangunan) {
      toast.error("Nama Bangunan tidak boleh kosong!");
      setStep(1);
      return;
    }

    const paketData = { identitas, dataKerusakan: rows };

    try {
      toast.loading("Sedang mengirim data ke server...");
      const respons = await axios.post("http://localhost:3000/api/simpan-survei", paketData);

      if (respons.data.status === 'sukses') {
        toast.dismiss();
        toast.success(respons.data.pesan);
        localStorage.removeItem("survei_draf"); // Hapus draf jika sukses
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal menyimpan data! Pastikan backend Node.js sudah menyala.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Inspeksi Lapangan</h1>
          <p className="text-sm text-muted-foreground mt-1">Lengkapi data secara bertahap.</p>
        </div>
        <Button variant="outline" onClick={simpanDraf} className="gap-2">
          <Save className="h-4 w-4" /> Simpan Draf
        </Button>
      </div>

      {/* Stepper (Responsive) */}
      <Card className="p-4 rounded-2xl shadow-sm border-muted/60">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer" onClick={() => setStep(s.id)}>
              <div className={`h-8 w-8 rounded-full grid place-items-center font-bold text-xs transition-all ${step >= s.id ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20" : "bg-muted text-muted-foreground"
                }`}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <div className={`text-[10px] font-semibold text-center whitespace-nowrap ${step === s.id ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Konten Step */}
      <div className="min-h-[50vh]">
        {step === 1 && <Step1 identitas={identitas} setIdentitas={setIdentitas} />}
        {step === 2 && <StepKerusakan category={CATEGORIES[0]} rows={rows} setRows={setRows} />}
        {step === 3 && <StepKerusakan category={CATEGORIES[1]} rows={rows} setRows={setRows} />}
        {step === 4 && <StepKerusakan category={CATEGORIES[2]} rows={rows} setRows={setRows} />}
        {step === 5 && <StepKerusakan category={CATEGORIES[3]} rows={rows} setRows={setRows} />}
      </div>

      {/* Navigasi Bawah */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
        </Button>
        {step < totalSteps ? (
          <Button onClick={() => setStep(step + 1)} className="bg-primary text-primary-foreground shadow-sm">
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
      // Validasi ekstensi
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
    <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border-muted/60 space-y-6">
      <div>
        <h2 className="text-lg font-bold">Data Umum Gedung</h2>
        <p className="text-xs text-muted-foreground">Isi informasi dasar bangunan yang akan diinspeksi.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2"><Label>Nama Bangunan</Label><Input value={identitas.namaBangunan} onChange={(e) => handleChange("namaBangunan", e.target.value)} placeholder="Mis. Gedung Serbaguna A" /></div>
        <div className="space-y-2"><Label>Tahun Dibangun</Label><Input type="number" value={identitas.tahunDibangun} onChange={(e) => handleChange("tahunDibangun", e.target.value)} placeholder="2010" /></div>
        <div className="space-y-2"><Label>Jumlah Tingkat</Label><Input type="number" value={identitas.jumlahTingkat} onChange={(e) => handleChange("jumlahTingkat", e.target.value)} placeholder="3" /></div>
        <div className="space-y-2"><Label>Luas Total Lantai (m²)</Label><Input type="number" value={identitas.luasTotal} onChange={(e) => handleChange("luasTotal", e.target.value)} placeholder="1200" /></div>
        <div className="space-y-2"><Label>Luas Lantai Basement (m²)</Label><Input type="number" value={identitas.luasBasement} onChange={(e) => handleChange("luasBasement", e.target.value)} placeholder="0" /></div>

        <div className="space-y-2"><Label>Fungsi Bangunan</Label>
          <Select value={identitas.fungsi} onValueChange={(v) => handleChange("fungsi", v)}>
            <SelectTrigger><SelectValue placeholder="Pilih fungsi" /></SelectTrigger>
            <SelectContent>
              {/* Opsi Fungsi Diperbanyak */}
              {["Fungsi Hunian", "Fungsi Keagamaan", "Fungsi Usaha", "Fungsi Sosial Budaya", "Fungsi Khusus", "Fungsi Ganda/Campuran"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2"><Label>Klasifikasi Bangunan</Label>
          <Select value={identitas.klasifikasi} onValueChange={(v) => handleChange("klasifikasi", v)}>
            <SelectTrigger><SelectValue placeholder="Pilih klasifikasi" /></SelectTrigger>
            <SelectContent>
              {["Sederhana", "Tidak Sederhana", "Khusus"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Nama Pemilik</Label><Input value={identitas.namaPemilik} onChange={(e) => handleChange("namaPemilik", e.target.value)} placeholder="Pemilik / Instansi" /></div>
        <div className="space-y-2"><Label>Alamat Lengkap</Label><Input value={identitas.alamat} onChange={(e) => handleChange("alamat", e.target.value)} placeholder="Jl. Raya..." /></div>
      </div>

      {/* Upload As Built Drawing */}
      <div className="pt-4 border-t">
        <Label className="block mb-2">Gambar Bangunan / As-Built Drawing (PDF/JPG)</Label>
        <div className="flex items-center gap-4">
          <input type="file" accept=".pdf, image/jpeg, image/png" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Pilih File
          </Button>
          {identitas.asBuiltDrawing && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="h-3 w-3" /> File terunggah
            </span>
          )}
        </div>
      </div>

      <div>
        <Label className="block mb-2">Catatan Tambahan</Label>
        <Textarea value={identitas.catatan} onChange={(e) => handleChange("catatan", e.target.value)} placeholder="Kondisi lingkungan sekitar..." rows={3} />
      </div>
    </Card>
  );
}


// --- KOMPONEN STEP KERUSAKAN ---
function StepKerusakan({ category, rows, setRows }: { category: (typeof CATEGORIES)[number], rows: DamageRow[], setRows: any }) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className={`h-4 w-4 rounded-full ${category.color.split(' ')[0]}`} />
          {category.label}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Catat detail kerusakan untuk setiap komponen {category.label.toLowerCase()}.</p>
      </div>

      {/* Render Tabel Terpisah per Komponen */}
      {category.components.map((comp) => (
        <ComponentTable key={comp.name} component={comp} categoryKey={category.key} rows={rows} setRows={setRows} />
      ))}
    </div>
  );
}

// --- SUB-KOMPONEN: TABEL PER KOMPONEN & AUTO-GENERATE ---
function ComponentTable({ component, categoryKey, rows, setRows }: { component: any, categoryKey: string, rows: DamageRow[], setRows: any }) {
  const [jumlahGen, setJumlahGen] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const componentRows = rows.filter(r => r.komponen === component.name);

  // Fungsi membuat singkatan otomatis (Contoh: Pondasi -> P)
  const getPrefix = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase();

  // Fungsi Auto Generate Baris
  const handleGenerate = () => {
    const count = parseInt(jumlahGen);
    if (isNaN(count) || count <= 0) return;

    const prefix = getPrefix(component.name);
    const existingCount = componentRows.length;

    const newRows = Array.from({ length: count }).map((_, i) => ({
      id: crypto.randomUUID(),
      kategoriKey: categoryKey,
      kode: `${prefix}${existingCount + i + 1}`, // Bikin P1, P2, P3 otomatis
      komponen: component.name,
      jenis: component.jenisKerusakan[0],
      volumeTotal: "", panjang: "", lebar: "", tinggi: "", volumeKerusakan: "",
      satuan: component.unit,
      foto: null
    }));

    setRows((prev: DamageRow[]) => [...prev, ...newRows]);
    setJumlahGen(""); // Kosongkan input setelah diklik
    toast.success(`${count} baris ${component.name} berhasil ditambahkan!`);
  };

  const update = (id: string, patch: Partial<DamageRow>) => {
    setRows((r: DamageRow[]) => r.map((row) => {
      if (row.id !== id) return row;
      const updatedRow = { ...row, ...patch };
      
      // Logika Volume PxLxT
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
    <Card className="rounded-xl shadow-sm border overflow-hidden bg-white">
      {/* Header Komponen & Input Generate */}
      <div className="bg-slate-50 border-b p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm">Komponen: {component.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Jumlah {component.name}:</Label>
          <Input 
            type="number" 
            placeholder="Mis: 10" 
            className="h-8 w-20 text-center" 
            value={jumlahGen} 
            onChange={(e) => setJumlahGen(e.target.value)} 
          />
          <Button size="sm" onClick={handleGenerate} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-1" /> Generate
          </Button>
        </div>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead className="bg-muted/30 text-xs uppercase text-muted-foreground border-b">
            <tr>
              <th className="px-3 py-3 text-left w-20">Kode</th>
              <th className="px-3 py-3 text-left w-64">Jenis Kerusakan</th>
              <th className="px-3 py-3 text-center">Dimensi (P x L x T)</th>
              <th className="px-3 py-3 text-center w-28">Vol Total</th>
              <th className="px-3 py-3 text-center w-28">Vol Rusak</th>
              <th className="px-3 py-3 text-center w-16">Satuan</th>
              <th className="px-3 py-3 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {componentRows.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-xs text-muted-foreground italic">Belum ada data. Masukkan jumlah dan klik Generate.</td></tr>
            ) : (
              componentRows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <Input value={row.kode} onChange={(e) => update(row.id, { kode: e.target.value })} className="h-8 font-mono bg-white" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Select value={row.jenis} onValueChange={(v) => update(row.id, { jenis: v })}>
                        <SelectTrigger className="h-8 bg-white flex-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {component.jenisKerusakan.map((j: string) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      
                      {/* Tombol Info Rekomendasi */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 shrink-0">
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-lg flex items-center gap-2">
                              <Info className="h-5 w-5 text-blue-500" />
                              Penanganan: {component.name} - {row.jenis}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground bg-slate-50 p-4 rounded-md border">
                            {REKOMENDASI_MAP[`${component.name}_${row.jenis}`] || REKOMENDASI_MAP["default"]}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <Input type="number" placeholder="P" className="h-8 w-16 text-center" value={row.panjang} onChange={(e) => update(row.id, {panjang: e.target.value})} disabled={row.satuan === 'unit' || row.satuan === 'titik'}/>
                      <span className="text-muted-foreground text-xs">×</span>
                      <Input type="number" placeholder="L" className="h-8 w-16 text-center" value={row.lebar} onChange={(e) => update(row.id, {lebar: e.target.value})} disabled={row.satuan === 'm¹' || row.satuan === 'unit' || row.satuan === 'titik'}/>
                      <span className="text-muted-foreground text-xs">×</span>
                      <Input type="number" placeholder="T" className="h-8 w-16 text-center" value={row.tinggi} onChange={(e) => update(row.id, {tinggi: e.target.value})} disabled={row.satuan === 'm²' || row.satuan === 'm¹' || row.satuan === 'unit' || row.satuan === 'titik'}/>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" placeholder="0" className="h-8 text-center bg-white" value={row.volumeTotal} onChange={(e) => update(row.id, {volumeTotal: e.target.value})} />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" placeholder="0" className="h-8 text-center border-emerald-300 bg-emerald-50 font-bold" value={row.volumeKerusakan} onChange={(e) => update(row.id, {volumeKerusakan: e.target.value})} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-xs font-bold text-muted-foreground bg-slate-100 px-2 py-1 rounded">{row.satuan}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.foto ? (
                        <div className="relative group rounded border overflow-hidden h-8 w-8 cursor-pointer" onClick={() => update(row.id, { foto: null })}>
                          <img src={row.foto} alt="Bukti" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => { setActiveRowId(row.id); fileInputRef.current?.click(); }}>
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => removeRow(row.id)}>
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