import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      
      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="space-y-2">
          {/* Judul & Subjudul */}
          <Skeleton className="h-9 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="flex items-center gap-2">
          {/* Tombol Tambah & Info Total */}
          <Skeleton className="h-5 w-[150px] hidden md:block" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>
      
      {/* Grid Content Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Kita buat simulasi 8 kartu loading */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-gray-50/50 pb-4 border-b">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[120px]" /> {/* Nama Mesin */}
                  <Skeleton className="h-4 w-[80px]" />  {/* Tipe */}
                </div>
                <Skeleton className="h-6 w-[70px] rounded-full" /> {/* Badge Status */}
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-[60px]" /> {/* ID */}
                
                <div className="flex gap-2">
                  {/* Tombol Edit & Delete */}
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-[60px] rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}