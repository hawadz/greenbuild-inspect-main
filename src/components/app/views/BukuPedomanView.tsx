export function BukuPedomanView() {
  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buku Pedoman</h1>
        <p className="text-muted-foreground">
          Pedoman Pemeriksaan dan Penanganan Kerusakan Bangunan Gedung
        </p>
      </div>
      
      {/* Container PDF */}
      <div className="flex-1 w-full min-h-[75vh] border rounded-lg overflow-hidden bg-muted/20">
        <iframe
          src="/buku-pedoman.pdf"
          className="w-full h-full"
          title="Buku Pedoman PDF"
        />
      </div>
    </div>
  );
}