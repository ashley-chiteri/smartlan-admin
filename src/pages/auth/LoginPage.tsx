// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from "lucide-react";
import { config } from '@/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
}

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(`${config.API_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data: LoginResponse = await response.json();

        if (data.success) {
            localStorage.setItem('authToken', data.token as string);
            toast.success('Login successful! Welcome back.');
            // Redirect to the dashboard page after successful login
            navigate('/dashboard/overview');
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            toast.error(err.message || 'Login failed');
        } else {
            toast.error('Login failed');
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-sm rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Smartlan Admin
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sign in to manage your inventory and orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#004d66] text-white hover:bg-[#004d63]/80 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
          <Separator className="my-4 dark:bg-gray-800" />
          <p>This is a private administration panel.</p>
        </CardFooter>
      </Card>
    </div>
  );
}