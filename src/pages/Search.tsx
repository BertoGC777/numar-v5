import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const results = products.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q));

  return (
    <Layout>
      <div className="container-numar py-12">
        <h1 className="font-serif text-4xl mb-2">Resultados para "{q}"</h1>
        <p className="text-sm text-muted-foreground mb-8">{results.length} produto{results.length !== 1 && "s"} encontrado{results.length !== 1 && "s"}</p>
        {results.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
