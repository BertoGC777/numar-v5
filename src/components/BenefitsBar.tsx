import { Truck, CreditCard, MessageCircle, Store } from "lucide-react";

const items = [
  { icon: Truck, text: "Enviamos para todo o Brasil" },
  { icon: CreditCard, text: "Parcele sem juros" },
  { icon: MessageCircle, text: "Compre pelo WhatsApp" },
  { icon: Store, text: "Retire na loja física" },
];

export default function BenefitsBar() {
  return (
    <section className="bg-card border-y border-border">
      <div className="container-numar grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center justify-center gap-3 py-5 px-3 text-center">
            <Icon className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
