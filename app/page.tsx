import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  WashingMachine, 
  Smartphone, 
  Clock, 
  QrCode, 
  ArrowRight,
  Users,
  Activity,
  CheckCircle2
} from "lucide-react"

export default async function LandingPage() {
  const session = await auth()

  const availableMachines = await prisma.machine.count({ where: { status: "AVAILABLE" } })
  const busyMachines = await prisma.machine.count({ where: { status: "BUSY" } })
  const totalUsers = await prisma.user.count({ where: { role: Role.CUSTOMER } })
  const totalBookings = await prisma.booking.count()

  return (
    // REVISI: Ubah 'div' menjadi 'main' agar struktur HTML valid & mengatasi hydration mismatch
    <main className="flex flex-col min-h-screen bg-white animate-in fade-in duration-700">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* ... (SISA KODE KE BAWAH SAMA PERSIS) ... */}
        {/* ... Pastikan Anda menyalin semua section di bawah ini ... */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />
        
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100 fill-mode-backwards">
            <Badge variant="outline" className="mb-6 py-1.5 px-4 text-blue-700 bg-blue-50 border-blue-200">
              Revolusi Laundry Modern #1
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Laundry Lebih Cerdas, <br className="hidden md:block"/> 
              <span className="text-blue-600">Hidup Lebih Bebas.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pantau status mesin secara <strong>real-time</strong>, booking dari mana saja, dan bayar dengan QRIS tanpa antri.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session?.user ? (
                <Link href={session.user.role === 'ADMIN' ? "/admin/dashboard" : "/dashboard"}>
                  <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all rounded-full hover:scale-105 active:scale-95 duration-200">
                    Buka Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all rounded-full hover:scale-105 active:scale-95 duration-200">
                    Mulai Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-slate-300 hover:bg-slate-50 transition-all">
                  Pelajari Dulu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP (DATA ASLI) */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300 fill-mode-backwards">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Tersedia</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">{availableMachines}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Unit Siap Pakai</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <WashingMachine className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Digunakan</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">{busyMachines}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Unit Sedang Berjalan</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Pelanggan</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">{totalUsers}+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Terdaftar Aktif</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Transaksi</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">{totalBookings}+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Cucian Selesai</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-in zoom-in-95 duration-700 delay-500">
            <h2 className="text-3xl font-bold text-slate-900">Kenapa Memilih WashPoint?</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Sistem pintar yang menghubungkan Anda dengan mesin laundry secara langsung.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kontrol Penuh</h3>
              <p className="text-slate-500 leading-relaxed">
                Mulai mesin, atur mode cuci, dan pantau durasi langsung dari aplikasi Anda tanpa perlu koin.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-200">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pembayaran Instan</h3>
              <p className="text-slate-500 leading-relaxed">
                Scan QRIS langsung dari dashboard. Transaksi otomatis terverifikasi dan mesin langsung menyala.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-300">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cek Ketersediaan</h3>
              <p className="text-slate-500 leading-relaxed">
                Lihat jumlah mesin yang tersedia ({availableMachines} unit saat ini) dari rumah agar tidak perlu antri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 animate-in slide-in-from-left-8 duration-1000">
               <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop" 
                alt="Laundry Process" 
                className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
               />
            </div>
            <div className="md:w-1/2 space-y-8 animate-in slide-in-from-right-8 duration-1000">
              <h2 className="text-3xl font-bold text-slate-900">Cara Kerja Simpel</h2>
              <div className="space-y-6">
                {[
                  { title: "Pilih Mesin", desc: `Pilih salah satu dari ${availableMachines + busyMachines} mesin kami yang tersedia di aplikasi.` },
                  { title: "Bayar QRIS", desc: "Lakukan pembayaran aman dan cepat dalam hitungan detik." },
                  { title: "Mulai Mencuci", desc: "Klik tombol 'Mulai' di HP Anda, mesin akan otomatis berputar." },
                  { title: "Ambil Cucian", desc: "Status berubah menjadi 'Selesai' saat proses pencucian berakhir." },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{step.title}</h4>
                      <p className="text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FOOTER */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000 delay-200">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10 max-w-2xl mx-auto space-y-6">
               <h2 className="text-3xl md:text-4xl font-bold">Gabung dengan {totalUsers}+ Pengguna Lain</h2>
               <p className="text-blue-100 text-lg">
                 Nikmati pengalaman mencuci yang efisien, transparan, dan modern sekarang juga.
               </p>
               <div className="pt-4">
                 <Link href="/register">
                   <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                     Buat Akun Gratis
                   </Button>
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <div className="bg-blue-600 text-white p-1 rounded-lg">
              <WashingMachine size={20} />
            </div>
            WashPoint
          </div>
          <div className="text-slate-500 text-sm">
            &copy; 2024 WashPoint System. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}