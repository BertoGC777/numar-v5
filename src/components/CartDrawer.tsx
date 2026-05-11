import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, itemKey } from "@/context/CartContext";
import { formatBRL } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CartDrawer() {
  const { isOpen, close, items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<string | null>(null);

  const calcShipping = () => {
    if (cep.replace(/\D/g, "").length !== 8) {
      setShipping("CEP inválido");
      return;
    }
    setShipping(subtotal >= 300 ? "Frete grátis ✨" : "R$ 19,90 — 5 a 8 dias úteis");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-background p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-serif text-2xl">Sua sacola ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Sua sacola está vazia</p>
            <Button onClick={close} variant="default">Continuar comprando</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => {
                const key = itemKey(item);
                return (
                  <div key={key} className="flex gap-3 pb-4 border-b">
                    <Link to={`/produto/${item.slug}`} onClick={close} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-28 object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/produto/${item.slug}`} onClick={close} className="text-sm font-medium hover:text-primary line-clamp-2">{item.name}</Link>
                      <p className="text-xs text-muted-foreground mt-1">Cor: {item.color} · Tam: {item.size}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{formatBRL(item.pricePix)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button className="p-1.5 hover:bg-muted" onClick={() => updateQty(key, item.quantity - 1)} aria-label="Diminuir"><Minus className="h-3 w-3" /></button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button className="p-1.5 hover:bg-muted" onClick={() => updateQty(key, item.quantity + 1)} aria-label="Aumentar"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeItem(key)} aria-label="Remover" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t px-6 py-4 space-y-3 bg-muted/30">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Calcular frete</label>
                <div className="flex gap-2 mt-1">
                  <Input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" maxLength={9} />
                  <Button variant="outline" onClick={calcShipping}>OK</Button>
                </div>
                {shipping && <p className="text-xs mt-1 text-foreground/80">{shipping}</p>}
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm">Subtotal</span>
                <span className="font-serif text-2xl text-primary">{formatBRL(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">ou em até 3x sem juros no cartão</p>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-sm uppercase tracking-wider"
                onClick={() => { close(); navigate("/checkout"); }}>
                Finalizar Compra
              </Button>
              <Button variant="ghost" className="w-full" onClick={close}>Continuar comprando</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
