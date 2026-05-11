import Layout from "@/components/Layout";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import BenefitsBar from "@/components/BenefitsBar";
import CollectionsGrid from "@/components/CollectionsGrid";
import ProductCard from "@/components/ProductCard";
import SaleBanner from "@/components/SaleBanner";
import InstagramSection from "@/components/InstagramSection";
import { getFeatured } from "@/data/products";
import { Link } from "react-router-dom";

const Index = () => {
  const featured = getFeatured(8);
  return (
    <Layout>
      <HeroCarousel />
      <CategoryShortcuts />
      <BenefitsBar />
      <CollectionsGrid />

      <section className="container-numar py-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-2">Selecionados</p>
          <h2 className="font-serif text-3xl md:text-4xl">Destaques da Semana</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/catalogo" className="inline-block border border-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition">
            Ver todos os produtos
          </Link>
        </div>
      </section>

      <SaleBanner />
      <InstagramSection />
    </Layout>
  );
};

export default Index;
