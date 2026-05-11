import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart, itemKey } from "@/context/CartContext";
import { formatBRL } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, QrCode, Banknote, ChevronRight, Lock, MessageCircle } from "lucide-react";

type PayMethod = "pix" | "card" | "boleto";

export default function Checkout() {
  const { items, subtotal, close } = useCart();
  const [method, setMethod] = useState<PayMethod>("pix");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 300 ? 0 : 19.90;
  const discount = method === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - discount;

  const buildWppMsg = () => {
    const lines = items.map(
      (i) => `• ${i.name} | Cor: ${i.color} | Tam: ${i.size} | Qtd: ${i.quantity} | ${formatBRL(i.pricePix * i.quantity)}`
    );
    const payLabel = method === "pix" ? "Pix (5% de desconto)" : method === "card" ? "Cartão de crédito" : "Boleto";
    lines.push(`\nFrete: ${shipping === 0 ? "Grátis ✨" : formatBRL(shipping)}`);
    if (discount > 0) lines.push(`Desconto Pix: -${formatBRL(discount)}`);
    lines.push(`*Total: ${formatBRL(total)}*`);
    lines.push(`Pagamento: ${payLabel}`);
    return `Olá! Gostaria de finalizar meu pedido:\n\n${lines.join("\n")}`;
  };

  const handleCheckout = () => {
    setLoading(true);
    const msg = buildWppMsg();
    window.open(`https://wa.me/5521979674510?text=${encodeURIComponent(msg)}`, "_blank");
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-numar py-20 text-center">
          <h1 className="font-serif text-3xl mb-4">Seu carrinho está vazio</h1>
          <Link to="/catalogo"><Button>Ver produtos</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-numar py-8 max-w-5xl">
        <nav className="text-xs text-muted-foreground flex items-center gap-1 mb-8">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Finalizar Compra</span>
        </nav>

        <h1 className="font-serif text-3xl mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">

            {/* Payment method */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="font-serif text-xl mb-4">Forma de Pagamento</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: "pix" as PayMethod, icon: QrCode, label: "Pix", desc: "5% de desconto" },
                  { id: "card" as PayMethod, icon: CreditCard, label: "Cartão", desc: "3x sem juros" },
                  { id: "boleto" as PayMethod, icon: Banknote, label: "Boleto", desc: "Vence em 3 dias" },
                ].map(({ id, icon: Icon, label, desc }) => (
                  <button key={id} onClick={() => setMethod(id)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                      method === id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}>
                    <Icon className={`h-6 w-6 ${method === id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${method === id ? "text-primary" : ""}`}>{label}</span>
                    <span className="text-xs text-muted-foreground text-center">{desc}</span>
                  </button>
                ))}
              </div>

              {method === "pix" && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">✅ Pix com 5% de desconto!</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">Após confirmar, envie o pedido pelo WhatsApp e receba a chave Pix.</p>
                </div>
              )}
              {method === "card" && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">💳 Cartão em até 3x sem juros</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Após confirmar, combine o pagamento pelo WhatsApp ou aguarde integração com Mercado Pago.</p>
                </div>
              )}
              {method === "boleto" && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">📄 Boleto Bancário</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Vence em 3 dias úteis. Confirme pelo WhatsApp para receber o boleto.</p>
                </div>
              )}
            </div>

            {/* Customer info */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="font-serif text-xl mb-4">Seus Dados</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Nome" />
                  <Input placeholder="Sobrenome" />
                </div>
                <Input placeholder="E-mail" type="email" />
                <Input placeholder="CPF" />
                <Input placeholder="Telefone / WhatsApp" />
              </div>
            </div>

            {/* Address */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="font-serif text-xl mb-4">Endereço de Entrega</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <Input placeholder="CEP" />
                  <Button variant="outline" type="button">Buscar</Button>
                </div>
                <Input placeholder="Rua / Avenida" />
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <Input placeholder="Número" />
                  <Input placeholder="Complemento" />
                </div>
                <Input placeholder="Bairro" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Cidade" />
                  <Input placeholder="Estado" />
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="border border-border rounded-lg p-6 sticky top-24 space-y-4">
              <h2 className="font-serif text-xl">Resumo</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={itemKey(item)} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-20 object-cover rounded shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.color} · {item.size} · Qtd: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{formatBRL(item.pricePix * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "Grátis ✨" : formatBRL(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto Pix (5%)</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-xl pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatBRL(total)}</span>
                </div>
                {method === "card" && (
                  <p className="text-xs text-muted-foreground text-right">ou 3x de {formatBRL(total / 3)} sem juros</p>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full h-12 uppercase tracking-widest gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {loading ? "Abrindo WhatsApp..." : "Confirmar pelo WhatsApp"}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
