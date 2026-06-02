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
      {/* Left visual side */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-pastel p-12">
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6"/>
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#grid)"/>
            <g fill="white" opacity="0.55">
              <rect x="80" y="320" width="90" height="220" rx="6"/>
              <rect x="190" y="240" width="120" height="300" rx="6"/>
              <rect x="330" y="180" width="80" height="360" rx="6"/>
              <rect x="430" y="280" width="100" height="260" rx="6"/>
            </g>
            <g fill="oklch(0.32 0.1 162)" opacity="0.3">
              {[...Array(6)].map((_, r) =>
                [...Array(4)].map((_, c) => (
                  <rect key={`${r}-${c}`} x={200 + c * 28} y={260 + r * 38} width="14" height="20" rx="2"/>
                ))
              )}
            </g>
          </svg>
        </div>
        <div className="relative z-10 max-w-md text-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary shadow-card">
            <ShieldCheck className="h-3.5 w-3.5" /> Sistem Inspeksi Gedung
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight">
            Sistem Pemeriksaan & Penanganan Kerusakan Bangunan Gedung
          </h1>
          <p className="mt-4 text-base text-foreground/70">
            Pencatatan inspeksi struktur, non-struktur, utilitas dan finishing dalam satu platform yang ringan, akurat, dan kolaboratif.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              { n: "1.2k+", l: "Bangunan" },
              { n: "98%", l: "Akurasi" },
              { n: "24/7", l: "Akses" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/70 backdrop-blur p-3 shadow-card">
                <div className="text-xl font-bold text-primary">{s.n}</div>
                <div className="text-[11px] text-foreground/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-lift">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold tracking-tight">SIPPKBG</div>
              <div className="text-xs text-muted-foreground">Building Inspection System</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Selamat datang kembali</h2>
          <p className="text-sm text-muted-foreground mt-1">Masuk untuk melanjutkan inspeksi Anda.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Peran</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surveyor">Surveyor</SelectItem>
                  <SelectItem value="Pemilik Gedung">Pemilik Gedung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground font-semibold shadow-lift hover:opacity-95">
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} SIPPKBG · Sistem Inspeksi Gedung
          </p>
        </div>
      </div>
    </div>
  );
}
