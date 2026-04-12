import Navbar from "~/components/navbar";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-blue-50 dark:bg-slate-900">
            <Navbar/>
            {children}
        </div>
    );
}
