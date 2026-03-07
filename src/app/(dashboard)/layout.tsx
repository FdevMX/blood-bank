import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-background overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar - Oculto en impresión */}
      <div className="print:hidden h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden print:block print:h-auto print:overflow-visible">
        {/* Header - Oculto en impresión */}
        <div className="print:hidden">
          <Header session={session} />
        </div>
        
        <main className="flex-1 overflow-y-auto print:static print:block print:h-auto print:overflow-visible">
          <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto print:p-0 print:m-0 print:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
