import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
      
      {/* Skeleton untuk Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>

      {/* Skeleton untuk Grid Kartu Mesin */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Kita buat 6 kotak loading palsu */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-[150px]" /> {/* Nama Mesin */}
              <Skeleton className="h-6 w-[80px]" />  {/* Badge Status */}
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full mt-4" /> {/* Tombol */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}