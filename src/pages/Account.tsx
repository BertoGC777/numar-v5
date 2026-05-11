import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ShoppingBag, LogOut, Eye, EyeOff } from "lucide-react";

type User = { name: string; email: string; phone?: string };
type Tab = "login" | "register";
type Section = "profile" | "orders";

const STORAGE_KEY = "numar.user.v1";

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "hashed_" + Math.abs(hash).toString(36);
}

function saveUser(u: User) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }
function loadUser(): User | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}

export default function Account() {
  const [user, setUser] = useState<User | null>(loadUser);
  const [tab, setTab] = useState<Tab>("login");
  const [section, setSection] = useState<Section>("profile");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stored = loadUser();
    if (!form.email || !form.password) { setError("Preencha todos os campos."); return; }
    if (!stored || stored.email !== form.email) { setError("E-mail não encontrado."); return; }
    const pass = localStorage.getItem(`numar.pass.${form.email}`);
    if (pass !== hashPassword(form.password)) { setError("Senha incorreta."); return; }
    setUser(stored);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Preencha todos os campos obrigatórios."); return; }
    if (form.password !== form.confirm) { setError("As senhas não coincidem."); return; }
    if (form.password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    const newUser: User = { name: form.name, email: form.email, phone: form.phone };
    saveUser(newUser);
    const hashedPassword = hashPassword(form.password);
    localStorage.setItem(`numar.pass.${form.email}`, hashedPassword);
    setUser(newUser);
    setSuccess("Conta criada com sucesso!");
  };

  const handleLogout = () => { setUser(null); setForm({ name: "", email: "", phone: "", password: "", confirm: "" }); };

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = { ...user, name: form.name || user.name, phone: form.phone || user.phone };
    saveUser(updated);
    setUser(updated);
    setSuccess("Perfil atualizado!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // === LOGGED IN VIEW ===
  if (user) {
    return (
      <Layout>
        <div className="container-numar py-10 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl">Minha Conta</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>

          {/* Nav */}
          <div className="flex gap-1 border-b border-border mb-8">
            {([["profile", User, "Meu Perfil"], ["orders", ShoppingBag, "Meus Pedidos"]] as const).map(([s, Icon, label]) => (
              <button key={s} onClick={() => setSection(s as Section)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  section === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>

          {section === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary">{user.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-serif text-xl">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                </div>
              </div>

              {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 rounded p-3">{success}</p>}

              <form onSubmit={updateProfile} className="border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-serif text-lg">Editar Perfil</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
                    <Input defaultValue={user.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Telefone</label>
                    <Input defaultValue={user.phone} placeholder="(21) 99999-9999" onChange={set("phone")} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
                  <Input value={user.email} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground mt-1">O e-mail não pode ser alterado.</p>
                </div>
                <Button type="submit">Salvar alterações</Button>
              </form>
            </div>
          )}

          {section === "orders" && (
            <div className="border border-border rounded-lg p-8 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-serif text-xl mb-2">Nenhum pedido ainda</h2>
              <p className="text-sm text-muted-foreground mb-6">Seus pedidos aparecerão aqui após a integração com o sistema de pagamento.</p>
              <Button asChild variant="outline">
                <a href="/catalogo">Ver produtos</a>
              </Button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // === LOGIN / REGISTER VIEW ===
  return (
    <Layout>
      <div className="container-numar py-12 max-w-md">
        <h1 className="font-serif text-3xl text-center mb-2">Minha Conta</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          {tab === "login" ? "Entre para acessar seus pedidos" : "Crie sua conta Numar Store"}
        </p>

        {/* Tab switch */}
        <div className="flex border-b border-border mb-6">
          <button onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}>Entrar</button>
          <button onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "register" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}>Criar conta</button>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3 mb-4">{error}</p>}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
              <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Senha</label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="••••••" value={form.password} onChange={set("password")} required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 uppercase tracking-widest">Entrar</Button>
            <p className="text-xs text-center text-muted-foreground">
              Não tem conta?{" "}
              <button type="button" onClick={() => setTab("register")} className="text-primary hover:underline">Criar agora</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome completo *</label>
              <Input placeholder="Seu nome" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">E-mail *</label>
              <Input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telefone / WhatsApp</label>
              <Input placeholder="(21) 99999-9999" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Senha *</label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={form.password} onChange={set("password")} required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Confirmar senha *</label>
              <Input type="password" placeholder="Repita a senha" value={form.confirm} onChange={set("confirm")} required />
            </div>
            <Button type="submit" className="w-full h-11 uppercase tracking-widest">Criar Conta</Button>
            <p className="text-xs text-center text-muted-foreground">
              Já tem conta?{" "}
              <button type="button" onClick={() => setTab("login")} className="text-primary hover:underline">Entrar</button>
            </p>
          </form>
        )}
      </div>
    </Layout>
  );
}
