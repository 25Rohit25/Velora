import BottomNav from "@/components/navigation/BottomNav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen pb-24 z-10">
            {children}
            <BottomNav />
        </div>
    );
}
