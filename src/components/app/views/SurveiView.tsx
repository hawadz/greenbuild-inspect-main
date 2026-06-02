import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Upload, Camera, Plus, Trash2, Check, FileText, Image as ImageIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import axios from "axios"; // Perbaikan import axios

// Tipe Data
type DamageRow = {
  id: string;
  komponen: string;
  jenis: string;
  volumeTotal: string;
  volumeKerusakan: string;
  satuan: string;
  foto: string | null;
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
};

// Data Kategori Kerusakan
const CATEGORIES = [
  {
    key: "struktur",
    label: "Pekerjaan Struktur",
    color: "bg-emerald-100 text-emerald-700",
    components: [
      { name: "Pondasi", unit: "m³", jenisKerusakan: ["Deformasi/Turun", "Retak", "Bocor", "Rapuh", "Tidak ada kerusakan"] },
      { name: "Kolom", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah", "Tidak ada kerusakan"] },
      { name: "Balok dan Pelat", unit: "m³", jenisKerusakan: ["Melengkung", "Retak", "Patah/Remuk", "Bocor", "Tidak ada kerusakan"] },
      { name: "Plesteran Struktur", unit: "m³", jenisKerusakan: ["Retak rambut", "Pengelupasan dan Pelepasan", "Penggelambungan", "Pengkristalan Garam", "Tidak ada kerusakan"] },
      { name: "Rangka Atap", unit: "m³", jenisKerusakan: ["Melengkung", "Rusak/Patah", "Bocor", "Retak", "Korosi/Rapuh", "Sambungan lepas", "Tidak ada kerusakan"] },
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
      { name: "Dinding Plesteran", unit: "m³", jenisKerusakan: ["Retak rambut", "Celah", "Pengapuran", "Bocor", "Lapisan luar lepas/Terkelupas", "Lembab", "Berlumut/berjamur", "Ditumbuhi tanaman", "Terkikis", "Kotor", "Tidak ada kerusakan"] },
      { name: "Kaca", unit: "m²", jenisKerusakan: ["Retak", "Kondensasi", "Goresan atau Jamur", "Tidak ada kerusakan"] },
      { name: "Pintu", unit: "m²", jenisKerusakan: ["Berlubang", "Patah", "Rusak", "Sambungan lepas", "Melengkung", "Tidak ada kerusakan"] },
      { name: "Kusen", unit: "m³", jenisKerusakan: ["Lapuk termakan usia", "Rapuh/Keropos", "Retak", "Pudar", "Tidak ada kerusakan"] },
      { name: "Penutup Lantai", unit: "m²", jenisKerusakan: ["Retak", "Remuk", "Kerusakan pada sambungan", "Lepas", "Hilang", "Rusak", "Berbercak/Pudar", "Pecah/Patah", "Tidak ada kerusakan"] },
    ],
  },
  {
    key: "utilitas",
    label: "Pekerjaan Utilitas",
    color: "bg-sky-100 text-sky-700",
    components: [
      { name: "Instalasi Listrik", unit: "m¹", jenisKerusakan: ["Kabel/insulasi terbakar", "Korosi", "Label hilang/tidak tepat", "Kapasitas tidak cukup", "Sambungan longgar", "Ruang bebas", "Titik panas", "Air/uap air", "Tidak ada kerusakan"] },
      { name: "Instalasi Air", unit: "m¹", jenisKerusakan: ["Tekanan air", "Korosi", "Insulasi rusak", "Penahan pipa", "Katup bocor", "Pipa bocor", "Pembuangan air lambat", "Bercak", "Retak", "Tersumbat", "Tidak ada kerusakan"] },
      { name: "Drainase Limbah", unit: "m²", jenisKerusakan: ["Retak", "Bergelombang", "Amblas", "Ada bagian yang rusak", "Terkelupas", "Turun", "Pecah", "Tidak ada kerusakan"] },
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

export function SurveiView() {
  const [step, setStep] = useState(1);
  
  // STATE PUSAT: Menyimpan data dari Step 1 dan Step 2 di sini agar bisa dikirim
  const [identitas, setIdentitas] = useState<IdentitasGedung>({
    namaBangunan: "", tahunDibangun: "", jumlahTingkat: "", luasTotal: "", 
    luasBasement: "", fungsi: "", klasifikasi: "", namaPemilik: "", alamat: "", catatan: ""
  });

  const [rows, setRows] = useState<DamageRow[]>([
    { 
      id: crypto.randomUUID(), komponen: CATEGORIES[0].components[0].name, 
      jenis: CATEGORIES[0].components[0].jenisKerusakan[0], volumeTotal: "", 
      volumeKerusakan: "", satuan: CATEGORIES[0].components[0].unit, foto: null
    },
  ]);

  // FUNGSI MENGIRIM DATA KE BACKEND NODE.JS
  const simpanKeBackend = async () => {
    // Memastikan ada nama bangunan yang diisi
    if (!identitas.namaBangunan) {
      toast.error("Nama Bangunan tidak boleh kosong!");
      setStep(1);
      return;
    }

    const paketData = {
      identitas: identitas,
      dataKerusakan: rows
    };

    try {
      toast.loading("Sedang mengirim data ke server...");
      
      // Menggunakan Axios untuk menembak ke URL backend lokal
      const respons = await axios.post("http://localhost:3000/api/simpan-survei", paketData);
      
      if (respons.data.status === 'sukses') {
        toast.dismiss();
        toast.success(respons.data.pesan);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal menyimpan data! Pastikan backend Node.js sudah menyala.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Mulai Survei Baru</h1>
        <p className="text-sm text-muted-foreground mt-1">Lengkapi data umum dan data kerusakan bangunan.</p>
      </div>

      {/* Stepper */}
      <Card className="p-4 sm:p-6 rounded-2xl shadow-card">
        <div className="flex items-center gap-2 sm:gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-3">
              <div className={`shrink-0 h-10 w-10 rounded-full grid place-items-center font-bold text-sm transition-all ${
                step >= n ? "bg-gradient-primary text-primary-foreground shadow-lift" : "bg-muted text-muted-foreground"
              }`}>
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Step {n}</div>
                <div className={`text-sm font-semibold truncate ${step === n ? "text-foreground" : "text-muted-foreground"}`}>
                  {n === 1 ? "Data Umum Gedung" : "Data Kerusakan"}
                </div>
              </div>
              {n === 1 && <div className={`flex-1 h-0.5 rounded-full ${step > 1 ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </Card>

      {/* Menampilkan Step 1 atau Step 2 dengan melemparkan props state */}
      {step === 1 ? (
        <Step1 identitas={identitas} setIdentitas={setIdentitas} />
      ) : (
        <Step2 rows={rows} setRows={setRows} />
      )}

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep(1)}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>
        {step === 1 ? (
          <Button onClick={() => setStep(2)} className="bg-gradient-primary text-primary-foreground shadow-lift">
            Lanjut <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={simpanKeBackend} className="bg-gradient-primary text-primary-foreground shadow-lift">
            <Check className="h-4 w-4 mr-1" /> Simpan Survei
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}

function Step1({ identitas, setIdentitas }: { identitas: IdentitasGedung, setIdentitas: any }) {
  const handleChange = (field: keyof IdentitasGedung, value: string) => {
    setIdentitas((prev: IdentitasGedung) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 sm:p-8 rounded-2xl shadow-card space-y-6">
      <div>
        <h2 className="font-bold">Identitas Bangunan</h2>
        <p className="text-xs text-muted-foreground">Data umum gedung yang akan diperiksa.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Nama Bangunan"><Input value={identitas.namaBangunan} onChange={(e) => handleChange("namaBangunan", e.target.value)} placeholder="Mis. Gedung Serbaguna A" /></Field>
        <Field label="Tahun Dibangun"><Input type="number" value={identitas.tahunDibangun} onChange={(e) => handleChange("tahunDibangun", e.target.value)} placeholder="2010" /></Field>
        <Field label="Jumlah Tingkat"><Input type="number" value={identitas.jumlahTingkat} onChange={(e) => handleChange("jumlahTingkat", e.target.value)} placeholder="3" /></Field>
        <Field label="Luas Total Lantai (m²)"><Input type="number" value={identitas.luasTotal} onChange={(e) => handleChange("luasTotal", e.target.value)} placeholder="1200" /></Field>
        <Field label="Luas Lantai Basement (m²)"><Input type="number" value={identitas.luasBasement} onChange={(e) => handleChange("luasBasement", e.target.value)} placeholder="0" /></Field>
        <Field label="Fungsi Bangunan">
          <Select value={identitas.fungsi} onValueChange={(v) => handleChange("fungsi", v)}>
            <SelectTrigger><SelectValue placeholder="Pilih fungsi" /></SelectTrigger>
            <SelectContent>
              {["Hunian", "Pendidikan", "Kesehatan", "Perkantoran", "Sosial Budaya", "Keagamaan"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Klasifikasi Bangunan">
          <Select value={identitas.klasifikasi} onValueChange={(v) => handleChange("klasifikasi", v)}>
            <SelectTrigger><SelectValue placeholder="Pilih klasifikasi" /></SelectTrigger>
            <SelectContent>
              {["Sederhana", "Tidak Sederhana", "Khusus"].map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Nama Pemilik"><Input value={identitas.namaPemilik} onChange={(e) => handleChange("namaPemilik", e.target.value)} placeholder="Mis. Pemkot Jakarta Timur" /></Field>
        <Field label="Alamat"><Input value={identitas.alamat} onChange={(e) => handleChange("alamat", e.target.value)} placeholder="Jl. Raya Cipayung No. 12" /></Field>
      </div>

      <div className="sm:col-span-2 lg:col-span-3">
        <Label className="text-xs font-semibold">Catatan Tambahan</Label>
        <Textarea value={identitas.catatan} onChange={(e) => handleChange("catatan", e.target.value)} className="mt-1.5" placeholder="Tambahkan catatan kondisi lingkungan, akses, dll." rows={3} />
      </div>
    </Card>
  );
}

function Step2({ rows, setRows }: { rows: DamageRow[], setRows: any }) {
  return (
    <Card className="p-4 sm:p-6 rounded-2xl shadow-card relative">
      <div className="mb-4 px-2">
        <h2 className="font-bold">Data Kerusakan</h2>
        <p className="text-xs text-muted-foreground">Catat semua kerusakan per kategori pekerjaan.</p>
      </div>
      <Accordion type="multiple" defaultValue={["struktur"]} className="space-y-3">
        {CATEGORIES.map((cat) => (
          <AccordionItem key={cat.key} value={cat.key} className="border rounded-xl overflow-hidden bg-white">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${cat.color}`}>
                  {cat.key}
                </span>
                <span className="font-semibold text-sm">{cat.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <DamageTable category={cat} rows={rows} setRows={setRows} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

function DamageTable({ category, rows, setRows }: { category: (typeof CATEGORIES)[number], rows: DamageRow[], setRows: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraState, setCameraState] = useState<{isOpen: boolean, rowId: string | null}>({isOpen: false, rowId: null});
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<DamageRow>) =>
    setRows((r: DamageRow[]) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((r: DamageRow[]) => [
      ...r,
      { 
        id: crypto.randomUUID(), 
        komponen: category.components[0].name, 
        jenis: category.components[0].jenisKerusakan[0], 
        volumeTotal: "", 
        volumeKerusakan: "", 
        satuan: category.components[0].unit,
        foto: null
      },
    ]);

  const removeRow = (id: string) => setRows((r: DamageRow[]) => r.filter((row) => row.id !== id));

  const getJenisKerusakanList = (komponenName: string) => {
    const comp = category.components.find((c) => c.name === komponenName);
    return comp ? comp.jenisKerusakan : [];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeRowId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Mengubah gambar menjadi base64 sebelum dikirim ke database backend
        update(activeRowId, { foto: reader.result as string });
        toast.success("Foto berhasil diunggah!");
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startCamera = async (id: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraState({ isOpen: true, rowId: id });
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      toast.error("Tidak dapat mengakses kamera. Pastikan izin diberikan di browser Anda.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ isOpen: false, rowId: null });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraState.rowId) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      update(cameraState.rowId, { foto: dataUrl });
      stopCamera();
      toast.success("Foto berhasil dijepret!");
    }
  };

  // Hanya memfilter baris yang sesuai dengan kategori saat ini
  const categoryRows = rows.filter(row => category.components.some(c => c.name === row.komponen));

  return (
    <div className="space-y-3">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm min-w-[850px]">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-3 py-2.5">Komponen</th>
              <th className="text-left font-semibold px-3 py-2.5">Jenis Kerusakan</th>
              <th className="text-left font-semibold px-3 py-2.5">Volume Total</th>
              <th className="text-left font-semibold px-3 py-2.5">Vol. Kerusakan</th>
              <th className="text-left font-semibold px-3 py-2.5">Satuan</th>
              <th className="text-right font-semibold px-3 py-2.5">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-slate-50/50 transition-colors">
                <td className="px-3 py-2">
                  <Select
                    value={row.komponen}
                    onValueChange={(v) => {
                      const c = category.components.find((c) => c.name === v)!;
                      update(row.id, { komponen: v, satuan: c.unit, jenis: c.jenisKerusakan[0] });
                    }}
                  >
                    <SelectTrigger className="h-9 min-w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {category.components.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Select value={row.jenis} onValueChange={(v) => update(row.id, { jenis: v })}>
                    <SelectTrigger className="h-9 min-w-[220px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {getJenisKerusakanList(row.komponen).map((j) => (
                        <SelectItem key={j} value={j}>{j}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Input className="h-9 w-24" type="number" placeholder="0" value={row.volumeTotal} onChange={(e) => update(row.id, { volumeTotal: e.target.value })} />
                </td>
                <td className="px-3 py-2">
                  <Input className="h-9 w-24 border-red-200 focus-visible:ring-red-400" type="number" placeholder="0" value={row.volumeKerusakan} onChange={(e) => update(row.id, { volumeKerusakan: e.target.value })} />
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono font-bold">
                    {row.satuan}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    
                    {row.foto ? (
                      <div className="relative group rounded-md border overflow-hidden h-9 w-9 bg-slate-100">
                        <img src={row.foto} alt="Bukti" className="h-full w-full object-cover" />
                        <button 
                          onClick={() => update(row.id, { foto: null })} 
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus Foto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700">
                            <Camera className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => startCamera(row.id)} className="cursor-pointer gap-2">
                            <Camera className="h-4 w-4 text-emerald-600" />
                            <span>Buka Kamera (Live)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setActiveRowId(row.id);
                              fileInputRef.current?.click();
                            }} 
                            className="cursor-pointer gap-2"
                          >
                            <ImageIcon className="h-4 w-4 text-blue-600" />
                            <span>Pilih dari Galeri/File</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button size="icon" variant="ghost" type="button" onClick={() => removeRow(row.id)} className="h-9 w-9 text-destructive hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categoryRows.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">Belum ada data kerusakan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" onClick={addRow} type="button">
        <Plus className="h-4 w-4 mr-1" /> Tambah Komponen
      </Button>

      {/* MODAL KAMERA FULLSCREEN */}
      {cameraState.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in fade-in duration-200">
          <div className="p-4 flex justify-between items-center bg-black/50 text-white absolute top-0 left-0 right-0 z-10 backdrop-blur-sm">
            <span className="font-semibold tracking-wide">Kamera Web (Live)</span>
            <Button variant="ghost" size="icon" onClick={stopCamera} className="text-white hover:bg-white/20 rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-hidden relative bg-zinc-900">
            <video ref={videoRef} className="min-w-full min-h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-white/50 border-dashed rounded-lg" />
            </div>
          </div>
          
          <div className="p-8 flex justify-center absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
            <button 
              onClick={capturePhoto} 
              className="h-16 w-16 rounded-full bg-white border-4 border-emerald-500 hover:scale-95 active:scale-90 transition-transform flex items-center justify-center shadow-2xl"
              title="Jepret Foto"
            >
              <div className="h-12 w-12 rounded-full border-2 border-emerald-200 bg-emerald-50" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}