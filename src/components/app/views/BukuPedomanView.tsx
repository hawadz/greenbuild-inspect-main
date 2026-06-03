import { BookOpen, ExternalLink, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BukuPedomanView() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-indigo-950">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Buku Pedoman
          </h1>
          <p className="text-sm text-indigo-900/70 mt-1 font-medium">
            Panduan teknis pemeriksaan dan penanganan kerusakan bangunan gedung.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-2 shadow-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
            <a href="/buku-pedoman.pdf" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Buka Tab Baru
            </a>
          </Button>
          <Button size="sm" asChild className="gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all">
            <a href="/buku-pedoman.pdf" download="Buku_Pedoman_Survei.pdf">
              <Download className="h-4 w-4" /> Unduh PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Container PDF */}
      <Card className="flex-1 w-full min-h-[75vh] sm:min-h-[80vh] rounded-2xl shadow-sm border border-blue-100/60 overflow-hidden relative bg-slate-50/50">
        <iframe
          src="/buku-pedoman.pdf"
          className="absolute inset-0 w-full h-full border-0"
          title="Buku Pedoman PDF"
        />
      </Card>
    </div>
  );
}