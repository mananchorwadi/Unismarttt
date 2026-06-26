import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashLayout({ children, title, description }) {
  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
