export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-12 h-12 rounded-full border-2 border-gray-100 border-t-black animate-spin"></div>

        {/* Small center pulse */}
        <div className="absolute w-2 h-2 bg-black rounded-full animate-pulse"></div>
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-400 animate-pulse">
        Initializing Augur
      </p>
    </div>
  );
}

