import { useEffect, useState } from "react";

const messages = [
  "10% OFF na sua primeira compra",
  "Parcele em até 3x sem juros no cartão",
  "Compre pelo WhatsApp — atendimento personalizado",
];

export default function TopBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-topbar text-topbar-foreground text-xs">
      <div className="container-numar h-8 flex items-center justify-center overflow-hidden">
        <p key={idx} className="fade-in tracking-wide uppercase">{messages[idx]}</p>
      </div>
    </div>
  );
}
