import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Laundry App Siap! 🚀</CardTitle>
          <CardDescription>
            Database connect, UI component ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Project sudah siap untuk dikoding. Klik tombol di bawah untuk tes interaksi.
          </p>
          <Button className="w-full">Mulai Coding</Button>
        </CardContent>
      </Card>
    </div>
  );
}