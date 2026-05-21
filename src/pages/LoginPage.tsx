import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { School, Lock, User, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Admin | UAN 360°";
    
    // Redirect immediately if already logged in
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Harap isi semua kolom input!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali akun Anda.");
      }

      // Store auth session
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menghubungi server. Pastikan backend aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md z-10">
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-teal-400 to-blue-500 p-3 rounded-2xl text-slate-950 shadow-xl shadow-teal-500/10 mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-white">CMS Portal Admin</h1>
          <p className="text-xs text-slate-400 font-light mt-1">Masuk untuk mengelola data tur virtual 360°</p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-6 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-900 bg-slate-950/60 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-900 bg-slate-950/60 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-teal-500/10 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>
        </div>

        {/* Demo Mode Notice */}
        <div className="text-center mt-6 text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          Gunakan akun default untuk pengujian lokal:<br />
          <span className="font-mono text-teal-400 font-bold">username: admin</span> &middot; <span className="font-mono text-teal-400 font-bold">password: admin123</span>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
