import Navbar from "~/components/navbar";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
