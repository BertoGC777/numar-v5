import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getProductBySlug, getRelated, formatBRL } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, MessageCircle, ChevronRight, CreditCard, Banknote, QrCode } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { addItem } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container-numar py-20 text-center">
          <h1 className="font-serif text-3xl mb-4">Produto não encontrado</h1>
          <Link to="/catalogo" className="text-primary underline">Ver catálogo</Link>
        </div>
      </Layout>
    );
  }

  const numColors = product.colors.length;
  // Primary image: image for selected color
  const currentMainImg = product.images[colorIdx] ?? product.images[0];
  // All images for gallery: one per color + second photos
  const galleryImages = product.images;

  // When color changes, jump to that color's image
  const handleColorChange = (i: number) => {
    setColorIdx(i);
  };

  const related = getRelated(product.id, 4);
  const wppMsg = `Olá! Tenho interesse no produto: *${product.name}* - Cor: ${product.colors[colorIdx].name}\n${window.location.href}`;
  const wpp = `https://wa.me/5521979674510?text=${encodeURIComponent(wppMsg)}`;

  return (
    <Layout>
      <div className="container-numar py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground flex items-center gap-1 mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/catalogo/${product.category}`} className="hover:text-primary capitalize">
            {product.category.replace(/-/g, " ")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20 shrink-0 max-h-[600px] overflow-y-auto">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // if thumbnail is a color image (i < numColors), change color too
                    if (i < numColors) handleColorChange(i);
                  }}
                  className={`aspect-[3/4] overflow-hidden border-2 transition shrink-0 ${
                    currentMainImg === img ? "border-primary" : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-[3/4] bg-muted overflow-hidden">
              <img
                key={`${product.id}-${colorIdx}`}
                src={currentMainImg}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Product info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.name}</h1>

            {/* Price block */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                <span className="font-serif text-3xl text-primary">{formatBRL(product.pricePix)}</span>
                <span className="text-sm text-muted-foreground">no Pix</span>
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through ml-2">{formatBRL(product.oldPrice)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>ou <strong className="text-foreground">{formatBRL(product.priceCard)}</strong> em até 3x sem juros</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Banknote className="h-4 w-4" />
                <span>ou boleto bancário</span>
              </div>
            </div>

            {/* Color selector */}
            {numColors > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3">
                  Cor: <strong className="text-foreground">{product.colors[colorIdx].name}</strong>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorChange(i)}
                      aria-label={c.name}
                      title={c.name}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        i === colorIdx
                          ? "ring-2 ring-primary ring-offset-2 border-transparent scale-110"
                          : "border-border hover:border-foreground hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest mb-3">Tamanho</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 min-w-[48px] px-3 border text-sm transition font-medium ${
                      size === s
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-muted transition" aria-label="Diminuir">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-6 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-muted transition" aria-label="Aumentar">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => addItem(product, product.colors[colorIdx].name, size, qty, colorIdx)}
                className="w-full h-12 uppercase tracking-widest text-sm"
              >
                Adicionar ao Carrinho
              </Button>
              <a
                href={wpp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 border border-foreground uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition"
              >
                <MessageCircle className="h-4 w-4" /> Comprar pelo WhatsApp
              </a>
            </div>

            {/* Payment info */}
            <div className="mt-4 p-3 bg-muted/30 rounded text-xs text-muted-foreground text-center">
              🔒 Pagamento 100% seguro via Mercado Pago · Pix · Cartão · Boleto
            </div>

            {/* Accordion details */}
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="desc">
                <AccordionTrigger className="text-sm">Descrição</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{product.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="comp">
                <AccordionTrigger className="text-sm">Composição e cuidados</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Tecido de alta qualidade com acabamentos cuidadosos. Lavar à mão com água fria. Não usar alvejante. Não torcer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ent">
                <AccordionTrigger className="text-sm">Entrega e trocas</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Enviamos para todo o Brasil. Frete grátis em compras acima de R$300. Prazo de 3 a 8 dias úteis. Trocas aceitas em até 30 dias após o recebimento.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl text-center mb-8">Você também vai amar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
