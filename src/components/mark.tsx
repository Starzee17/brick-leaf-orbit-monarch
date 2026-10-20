export function TicketMark({ code }: { code: string }) {
  const cells: boolean[] = [];
  let n = 0;
  for (const ch of code) n = (n * 33 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 121; i++) {
    n = (n * 1664525 + 1013904223) >>> 0;
    cells.push((n & 3) !== 0 || i % 11 === 0 || Math.floor(i / 11) % 11 === 0);
  }
  return (
    <div className="grid grid-cols-11 gap-0.5 rounded-xl bg-ink p-3" aria-hidden>
      {cells.map((on, i) => (
        <span key={i} className={`aspect-square rounded-[2px] ${on ? "bg-bg" : "bg-transparent"}`} />
      ))}
    </div>
  );
}
