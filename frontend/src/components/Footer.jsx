export default function Footer() {
  return (
    <footer className="w-full py-5 px-8 mt-auto border-t border-slate-800/80 bg-slate-900 flex flex-col sm:flex-row justify-between items-center z-10 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
      <div className="text-sm font-medium text-slate-400">EL Project v1.0</div>
      <div className="text-xs mt-2 sm:mt-0">
        <a href="https://www.flaticon.com/free-icons/meter" title="meter icons" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
          Meter icons created by Smashicons - Flaticon
        </a>
      </div>
    </footer>
  );
}
