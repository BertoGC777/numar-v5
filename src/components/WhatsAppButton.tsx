import { MessageCircle } from "lucide-react";

const message = "Olá! Vi a Numar Store e gostaria de saber mais sobre os produtos.";
const phone = "5521979674510";
const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-[hsl(140_50%_40%)] text-white flex items-center justify-center shadow-elegant animate-pulse-soft hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
