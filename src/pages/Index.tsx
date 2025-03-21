import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Playground from '@/components/Playground';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Star, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  const themeStyles = {
    minecraft: "bg-[url('/images/minecraft-bg.jpg')] bg-cover bg-center",
    roblox: "bg-[url('/images/roblox-bg.jpg')] bg-cover bg-center",
    fortnite: "bg-[url('/images/fortnite-bg.jpg')] bg-cover bg-center",
    default: "bg-gradient-to-b from-sky/30 to-sky-200/30",
  };

  const overlayClass = preferences.theme !== 'default' ? 'bg-black/20' : '';
  const themeClass = themeStyles[preferences.theme] || themeStyles.default;
  
  const goBackToLearningMaterials = () => {
    navigate('/features');
  };

  return (
    <div className={`min-h-screen ${themeClass} ${overlayClass} flex flex-col p-4 md:p-8`}>
      <motion.header 
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white/80 hover:bg-white/90"
              onClick={goBackToLearningMaterials}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight inline-block">
              Balloon & Sandbag Math
            </h1>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Visualize integer addition and subtraction using balloons and sandbags.
            Explore our interactive 3D environment with draggable elements!
          </motion.p>
        </motion.div>

        {preferences.hasCompletedOnboarding && (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
              <Star className="h-5 w-5 mr-1.5 text-yellow-400" />
              <span className="font-bold text-white">{preferences.points}</span>
            </div>
            
            <Button variant="outline" size="sm" asChild className="bg-white/80 hover:bg-white/90">
              <Link to="/settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.header>
      
      <motion.div 
        className="flex-1 rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto w-full bg-white/90 backdrop-blur-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Playground />
      </motion.div>
      
      <motion.footer 
        className="mt-8 text-center text-white/90 text-sm drop-shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>
          Click on balloons or sandbags to remove them. Use the controls to add more.
          Try dragging the balloons and sandbags to see how they interact!
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
