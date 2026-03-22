export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-slate-800 text-center text-sm text-slate-500">
            <div className="flex flex-col items-center justify-center gap-2">
                <p className="font-medium text-slate-400">EL Project v1.0</p>
                <div className="text-xs">
                    <a href="https://www.flaticon.com/free-icons/meter" title="meter icons" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
                        Meter icons created by Smashicons - Flaticon
                    </a>
                </div>
            </div>
        </footer>
    );
}
