import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Cpu, Lock, User, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import React from 'react';

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'technician' | 'sales') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const credentials = {
        admin: { username: "admin", password: "admin123" },
        technician: { username: "tech", password: "tech123" },
        sales: { username: "sales", password: "sales123" }
      };

      if (username === credentials.admin.username && password === credentials.admin.password) {
        onLogin('admin');
      } else if (username === credentials.technician.username && password === credentials.technician.password) {
        onLogin('technician');
      } else if (username === credentials.sales.username && password === credentials.sales.password) {
        onLogin('sales');
      } else {
        setError("Invalid credentials.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl mb-6 relative group">
              <Cpu className="w-10 h-10 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </div>
            <h1 className="text-blue-900 mb-2 flex items-center justify-center gap-2">
              Chiptronix
              <Sparkles className="w-5 h-5 text-blue-600" />
            </h1>
            <p className="text-gray-600">Professional Laptop Repair CRM</p>
          </div>

          {/* Login card with glassmorphism */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all"></div>
            
            {/* Main card */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 h-5 w-5 text-gray-900" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 h-5 w-5 text-gray-900" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all rounded-xl relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Demo credentials */}

              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Powered by Chiptronix © 2025</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
