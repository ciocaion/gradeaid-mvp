import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200">
      <motion.div 
        className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto bg-red-100 w-20 h-20 flex items-center justify-center rounded-full mb-6"
        >
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <Button 
          onClick={() => navigate('/home')} 
          className="shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          <Home className="mr-2 h-5 w-5" /> Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
