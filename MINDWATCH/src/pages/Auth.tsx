
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { loginUser, registerUser } from "@/utils/localAuth";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        const success = loginUser(phone, password);
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome to your daily journal!",
          });
          navigate("/journal");
        } else {
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Please check your phone number and password",
          });
        }
      } else {
        const success = registerUser(phone, password);
        if (success) {
          toast({
            title: "Registration successful",
            description: "You can now login with your credentials",
          });
          setIsLoginMode(true);
          setPhone("");
          setPassword("");
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "This phone number is already registered",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div 
        className={`w-full ${isLoginMode ? 'max-w-md' : 'max-w-lg'} 
        p-8 space-y-6 bg-white rounded-xl shadow-lg 
        transition-all duration-300 ease-in-out
        ${isLoginMode ? 'scale-100' : 'scale-105'}`}
      >
        <div className="space-y-2 text-center">
          <h1 className={`font-bold tracking-tighter ${isLoginMode ? 'text-3xl' : 'text-4xl'}`}>
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h1>
          <p className={`text-gray-500 ${isLoginMode ? 'text-sm' : 'text-base'}`}>
            {isLoginMode 
              ? "Sign in to access your daily journal" 
              : "Sign up to start your journaling journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full ${!isLoginMode && 'h-12'}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ${!isLoginMode && 'h-12'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full ${!isLoginMode && 'h-12 text-lg'}`}
            disabled={isLoading}
          >
            {isLoading 
              ? (isLoginMode ? "Signing in..." : "Creating account...") 
              : (isLoginMode ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setPhone("");
              setPassword("");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLoginMode 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        mindwatch, by Shar K.
      </div>
    </div>
  );
};

export default Auth;
