import Navbar from "~/components/navbar";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-bg-main transition-colors duration-300 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
