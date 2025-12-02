import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-bg-primary">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block h-full">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header - Visible only on mobile */}
                <MobileHeader />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                    <div className="mx-auto max-w-7xl animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Navigation - Visible only on mobile */}
            <MobileNav />
        </div>
    );
}
