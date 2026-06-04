import { useState } from "react";
import { Building2, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Props = {
  onLogin: (user: { email: string; role: string }) => void;
};

export function LoginView({ onLogin }: Props) {
  const [email, setEmail] = useState("surveyor@gedung.id");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("Surveyor");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, role });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual side - Tema Gemini Blue */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-12">
        <div className="absolute inset-0 opacity-40">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#grid)"/>
            <g fill="white" opacity="0.6">
              <rect x="80" y="320" width="90" height="220" rx="6"/>
              <rect x="190" y="240" width="120" height="300" rx="6"/>
              <rect x="330" y="180" width="80" height="360" rx="6"/>
              <rect x="430" y="280" width="100" height="260" rx="6"/>
            </g>
            {/* Mengganti warna titik-titik menjadi indigo lembut */}
            <g fill="#6366f1" opacity="0.15">
              {[...Array(6)].map((_, r) =>
                [...Array(4)].map((_, c) => (
                  <rect key={`${r}-${c}`} x={200 + c * 28} y={260 + r * 38} width="14" height="20" rx="2"/>
                ))
              )}
            </g>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" /> Sistem Inspeksi Gedung
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-indigo-950">
            Sistem Pemeriksaan & Penanganan Kerusakan Bangunan
          </h1>
          <p className="mt-4 text-base text-indigo-900/70 font-medium">
            Pencatatan inspeksi struktur, non-struktur, utilitas dan finishing dalam satu platform yang ringan, akurat, dan kolaboratif.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              { n: "1.2k+", l: "Bangunan" },
              { n: "98%", l: "Akurasi" },
              { n: "24/7", l: "Akses" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/60 border border-white/50 backdrop-blur-md p-3 shadow-sm hover:bg-white/80 transition-colors">
                <div className="text-xl font-extrabold text-blue-700">{s.n}</div>
                <div className="text-[11px] font-bold text-indigo-900/60 uppercase tracking-wide mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 grid place-items-center shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-800">SIPPKBG</div>
              <div className="text-xs font-medium text-slate-500">Building Inspection System</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Selamat datang kembali</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Masuk untuk melanjutkan inspeksi Anda.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input id="password" type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Peran</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surveyor">Surveyor</SelectItem>
                  <SelectItem value="Pemilik Gedung">Pemilik Gedung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2">
              Masuk
            </Button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} SIPPKBG · Sistem Inspeksi Gedung
          </p>
        </div>
      </div>
    </div>
  );
}