/** QR genérico decorativo (não funcional) para o banner promocional. */
export function QrCodePlaceholder({ className = "" }: { className?: string }) {
  const cells = [
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 0, 1, 0,
    0, 1, 0, 1, 1, 0, 1,
    1, 1, 1, 0, 0, 1, 1,
  ];

  return (
    <div
      className={`grid grid-cols-7 gap-[2px] rounded-md bg-white p-1.5 shadow-inner ${className}`}
      aria-hidden
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-[1px] sm:h-2.5 sm:w-2.5 ${
            filled ? "bg-[#4a148c]" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}
