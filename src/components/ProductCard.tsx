import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, formatBRL } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [colorIdx, setColorIdx] = useState(0);

  const numColors = product.colors.length;
  // Primary image for selected color
  const mainImg = product.images[colorIdx] ?? product.images[0];
  // Hover image: second photo of same color (stored at colorIdx + numColors), or same image
  const hoverImg = product.images[colorIdx + numColors] ?? mainImg;

  const handleColorClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setColorIdx(i);
  };

  return (
    <div className="group fade-in">
      <Link to={`/produto/${product.slug}`} className="block relative overflow-hidden bg-muted aspect-[3/4]">
        <img
          key={`main-${colorIdx}`}
          src={mainImg}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          key={`hover-${colorIdx}`}
          src={hoverImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-2 py-1">Novo</span>
          )}
          {product.isSale && product.discount && (
            <span className="bg-destructive text-destructive-foreground text-[10px] uppercase tracking-wider px-2 py-1">
              -{product.discount}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="pt-3 space-y-2">
        <Link to={`/produto/${product.slug}`} className="block text-sm font-medium hover:text-primary line-clamp-1">
          {product.name}
        </Link>

        <div>
          <p className="text-base font-serif text-primary font-semibold">
            {formatBRL(product.pricePix)}{" "}
            <span className="text-xs font-sans text-muted-foreground">no Pix</span>
          </p>
          <p className="text-xs text-muted-foreground">ou {formatBRL(product.priceCard)} em até 3x</p>
        </div>

        {numColors > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => handleColorClick(e, i)}
                aria-label={c.name}
                title={c.name}
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  i === colorIdx
                    ? "ring-2 ring-primary ring-offset-1 border-transparent scale-110"
                    : "border-border hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-xs border-foreground hover:bg-foreground hover:text-background"
          onClick={() => addItem(product, product.colors[colorIdx].name, product.sizes[0], 1, colorIdx)}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
