import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero/hero-1.jpg";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero3 from "@/assets/hero/hero-3.jpg";

const slides = [
  {
    img: hero1,
    title: "Coleção Numar",
    subtitle: "Leveza e sofisticação para os seus dias",
    cta: "Ver Coleção",
    href: "/catalogo/lancamentos",
  },
  {
    img: hero2,
    title: "Lançamentos",
    subtitle: "Peças exclusivas que acabaram de chegar",
    cta: "Descobrir",
    href: "/catalogo/lancamentos",
  },
  {
    img: hero3,
    title: "Conjuntos & Vestidos",
    subtitle: "Looks que valorizam a sua silhueta",
    cta: "Ver Coleção",
    href: "/catalogo/conjuntos",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[60vh] md:h-[78vh] overflow-hidden bg-muted">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="container-numar pb-16 md:pb-0">
              <div className="max-w-xl text-white">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight">{s.title}</h1>
                <p className="text-base md:text-lg mb-6 opacity-95">{s.subtitle}</p>
                <Link
                  to={s.href}
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(i - 1)}
        aria-label="Anterior"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/40 transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(i + 1)}
        aria-label="Próximo"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/40 transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}
