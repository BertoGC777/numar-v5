import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="Numar Store">
      <span className="font-serif text-3xl md:text-4xl text-primary tracking-[0.18em]">NUMAR</span>
      <span className="font-sans text-[0.65rem] md:text-xs text-foreground/70 tracking-[0.4em] mt-0.5">STORE</span>
    </Link>
  );
}
