import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import BookingDialog from "@/components/customer/BookingDialog"
import WashController from "@/components/customer/WashController"
import { payBooking } from "@/app/actions/payment"
import { 
  LayoutDashboard, 
  WashingMachine, 
  CreditCard, 
  CheckCircle2, 
  PlayCircle
} from "lucide-react"

const MACHINE_IMAGES = {
  Washer: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800&auto=format&fit=crop",
  Dryer: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=800&auto=format&fit=crop"
}

export default async function DashboardPage() {
  const session = await auth()
  
  const machines = await prisma.machine.findMany({ orderBy: { name: 'asc' }})
  const availableCount = machines.filter(m => m.status === 'AVAILABLE').length
  
  const myBookings = await prisma.booking.findMany({
    where: { 
      userId: session?.user?.id,
      status: { not: "CANCELLED" },
      washStage: { not: "FINISHED" } 
    },
    include: { machine: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* WRAPPER UTAMA: Mengikuti lebar Navbar (container mx-auto px-4 md:px-8) */}
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Pelanggan</h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali, {session?.user?.name}</p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <div className="text-sm">
                  <span className="font-bold text-gray-900">{availableCount}</span>
                  <span className="text-gray-500 ml-1">Unit Tersedia</span>
                </div>
             </div>
          </div>
        </div>

        {/* Aktivitas Berjalan */}
        {myBookings.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
               <PlayCircle className="w-5 h-5 text-blue-600" />
               <h2>Status Cucian</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {myBookings.map(booking => (
                <Card key={booking.id} className="border border-blue-100 shadow-sm overflow-hidden bg-white">
                   <div className={`h-1.5 w-full ${booking.status === 'PAID' ? 'bg-blue-600' : 'bg-orange-500'}`} />
                   
                   <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4 items-center">
                           <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 border border-gray-200">
                             <WashingMachine size={24} />
                           </div>
                           <div>
                             <h3 className="font-bold text-gray-900">{booking.machine.name}</h3>
                             <p className="text-xs text-gray-500">{booking.machine.type} • ID: {booking.id.slice(-4)}</p>
                           </div>
                        </div>
                        <Badge variant={booking.status === 'PAID' ? 'default' : 'outline'} className={booking.status === 'PAID' ? 'bg-blue-600' : 'text-orange-600 border-orange-200'}>
                          {booking.status === 'PAID' ? 'PROSES' : 'UNPAID'}
                        </Badge>
                     </div>

                     <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        {booking.status === "PENDING" ? (
                          <div className="space-y-4">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Tagihan</span>
                                <span className="font-bold text-gray-900">Rp {booking.totalPrice.toLocaleString()}</span>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                               <form action={payBooking.bind(null, booking.id, "QRIS")} className="w-full">
                                 <Button className="w-full bg-slate-900 text-white hover:bg-black h-9">
                                   <CreditCard className="w-3 h-3 mr-2" /> QRIS
                                 </Button>
                               </form>
                               <form action={payBooking.bind(null, booking.id, "TRANSFER")} className="w-full">
                                 <Button variant="outline" className="w-full h-9 bg-white">Transfer</Button>
                               </form>
                             </div>
                          </div>
                        ) : (
                          <WashController booking={booking} />
                        )}
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Katalog Mesin */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
             <LayoutDashboard className="w-5 h-5 text-gray-500" />
             <h2>Pilih Mesin</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {machines.map((machine) => {
              const isAvailable = machine.status === "AVAILABLE"
              const imageSrc = machine.type === 'Washer' ? MACHINE_IMAGES.Washer : MACHINE_IMAGES.Dryer

              return (
                <div key={machine.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                  <div className="h-40 bg-gray-100 overflow-hidden relative">
                    <img 
                      src={imageSrc} 
                      alt={machine.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={isAvailable ? 'bg-white text-green-700 hover:bg-white' : 'bg-gray-900 text-white hover:bg-gray-900'}>
                        {machine.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{machine.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                         <span>{machine.type}</span>
                         <span>•</span>
                         <span>{machine.capacity} Kg</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      {isAvailable ? (
                        <BookingDialog machine={machine} />
                      ) : (
                        <Button disabled variant="secondary" className="w-full bg-gray-100 text-gray-400">
                          Tidak Tersedia
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}