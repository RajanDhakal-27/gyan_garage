export function ClayBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#7C3AED]/10 blur-3xl animate-clay-float" />
      <div className="absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#DB2777]/10 blur-3xl animate-clay-float-delayed" />
      <div className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#0EA5E9]/10 blur-3xl animate-clay-float-slow" />
      <div className="absolute left-8 top-2/3 h-64 w-64 rounded-full bg-[#10B981]/10 blur-3xl animate-clay-breathe" />
      <div className="absolute right-1/3 top-10 h-56 w-56 rounded-full bg-[#F59E0B]/10 blur-3xl animate-clay-float-delayed" />
      <div className="absolute bottom-1/3 right-8 h-72 w-72 rounded-full bg-[#A78BFA]/10 blur-3xl animate-clay-float-slow" />
    </div>
  );
}
