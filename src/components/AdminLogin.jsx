import { Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../lib/adminAuth";
import { Logo } from "./Logo";

export function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
      return;
    }
    setError("Login ou senha incorretos.");
  };

  return (
    <section id="admin" className="relative min-h-screen overflow-hidden bg-[#070707] px-4 py-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-24 flex justify-center opacity-70">
        <div className="font-display text-[18vw] font-semibold leading-none tracking-[0.12em] text-white/[0.018]">
          MIRVALIS
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-md rounded-sm surface p-6 shadow-gold sm:p-8"
      >
        <div className="mb-8">
          <Logo />
        </div>
        <div className="mb-7 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-mir-gold/35 text-mir-gold">
            <LockKeyhole size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-mir-gold">Área privada</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-white">Admin MIRVALIS</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
              Login
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
              placeholder="admin"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
              Senha
            </span>
            <div className="grid h-12 grid-cols-[1fr_auto] rounded-sm border border-white/10 bg-white/[0.04] focus-within:border-mir-gold/60">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ?"text" : "password"}
                autoComplete="current-password"
                className="min-w-0 bg-transparent px-4 text-sm text-white outline-none placeholder:text-mir-silver/38"
                placeholder="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="grid h-12 w-12 place-items-center text-mir-silver/62 transition hover:text-mir-gold"
                aria-label={showPassword ?"Ocultar senha" : "Mostrar senha"}
                title={showPassword ?"Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ?<EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-sm border border-mir-gold/20 bg-mir-gold/10 px-4 py-3 text-sm text-mir-silver">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-mir-gold px-5 text-sm font-semibold uppercase tracking-[0.18em] text-mir-black transition hover:bg-[#dfbd6a]"
          >
            <LogIn size={17} />
            Entrar
          </button>
        </form>
      </motion.div>
    </section>
  );
}
