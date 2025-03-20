
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  Gamepad2, Star, ArrowLeft, Trophy, 
  Crown, Medal, Award, Sparkles, 
  PartyPopper, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const gameActivities = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Match cards with the same math concepts',
    icon: <Sparkles className="h-12 w-12 text-amber-500" />,
    points: 20,
    badge: 'Memory Master',
    theme: 'bg-gradient-to-br from-amber-400 to-orange-500'
  },
  {
    id: 'puzzle',
    title: 'Math Puzzles',
    description: 'Solve fun puzzles using numbers and shapes',
    icon: <Trophy className="h-12 w-12 text-purple-500" />,
    points: 25,
    badge: 'Puzzle Pro',
    theme: 'bg-gradient-to-br from-purple-400 to-indigo-500'
  },
  {
    id: 'race',
    title: 'Math Race',
    description: 'Race to the finish by answering math questions',
    icon: <Crown className="h-12 w-12 text-emerald-500" />,
    points: 30,
    badge: 'Speed Champion',
    theme: 'bg-gradient-to-br from-emerald-400 to-teal-500'
  },
  {
    id: 'collect',
    title: 'Collectibles',
    description: 'Collect items by solving math problems',
    icon: <Medal className="h-12 w-12 text-blue-500" />,
    points: 15,
    badge: 'Collector',
    theme: 'bg-gradient-to-br from-blue-400 to-cyan-500'
  },
];

type FormValues = {
  activity: string;
};

const FunZone: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, addPoints, addBadge } = useUserPreferences();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [earnedReward, setEarnedReward] = useState<{points: number, badge: string} | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      activity: '',
    },
  });
  
  const themeStyles = {
    minecraft: "from-green-500/30 to-emerald-200/30",
    roblox: "from-red-500/30 to-rose-200/30",
    fortnite: "from-blue-500/30 to-purple-200/30",
    default: "from-sky/30 to-sky-200/30",
  };

  const gradientClass = themeStyles[preferences.theme] || themeStyles.default;
  
  const goBack = () => {
    navigate('/features');
  };
  
  const onSubmit = (data: FormValues) => {
    const activity = gameActivities.find(a => a.id === data.activity);
    if (!activity) return;
    
    setSelectedActivity(data.activity);
    
    // Simulate game completion with a delay
    setTimeout(() => {
      // Add points and badge
      addPoints(activity.points);
      addBadge(activity.badge);
      
      setEarnedReward({
        points: activity.points,
        badge: activity.badge
      });
      
      setShowRewardDialog(true);
    }, 1500);
    
    toast.success(`Starting ${activity.title}!`, {
      description: "Let's have some fun learning math!",
      icon: <Gamepad2 className="h-4 w-4" />
    });
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradientClass} flex flex-col p-4 md:p-8`}>
      <motion.header 
        className="flex justify-between items-center mb-8"
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
              className="h-8 w-8"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 tracking-tight inline-block">
              Fun Zone
            </h1>
          </div>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mt-3 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Play games, earn points, and collect badges while learning math!
          </motion.p>
        </motion.div>

        {preferences.hasCompletedOnboarding && (
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center">
              <Star className="h-5 w-5 mr-1.5 text-primary" />
              <span className="font-bold">{preferences.points}</span>
            </div>
          </motion.div>
        )}
      </motion.header>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem className="col-span-full space-y-6">
                    <FormLabel className="text-2xl font-bold text-center block">
                      Choose a Fun Activity
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {gameActivities.map((activity) => (
                          <motion.div 
                            key={activity.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative">
                              <Card 
                                className={`cursor-pointer transition-all overflow-hidden ${
                                  field.value === activity.id 
                                    ? 'border-primary shadow-lg ring-2 ring-primary ring-offset-2' 
                                    : 'hover:border-gray-300'
                                }`}
                              >
                                <div className={`h-20 ${activity.theme} flex items-center justify-center`}>
                                  {activity.icon}
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                  <div className="mt-2 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-amber-500" />
                                      <span className="text-sm font-medium">+{activity.points} points</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Award className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-medium">{activity.badge}</span>
                                    </div>
                                  </div>
                                </CardContent>
                                <div className="absolute top-2 right-2">
                                  <RadioGroupItem 
                                    value={activity.id} 
                                    id={activity.id} 
                                    className={field.value === activity.id ? "bg-primary" : ""}
                                  />
                                </div>
                              </Card>
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button 
                type="submit" 
                size="lg" 
                disabled={!form.watch('activity')}
                className="px-8 py-6 text-lg font-medium"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Start Playing
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
      
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <span className="flex items-center justify-center gap-2">
                <PartyPopper className="h-6 w-6 text-yellow-500" />
                Congratulations!
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You've completed the activity and earned rewards!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex flex-col items-center"
            >
              <Gift className="h-16 w-16 text-primary mb-2" />
              <div className="text-center">
                <p className="text-xl font-bold flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  {earnedReward?.points} Points
                </p>
                <p className="text-xl font-bold flex items-center justify-center mt-2">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  {earnedReward?.badge} Badge
                </p>
              </div>
            </motion.div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  setShowRewardDialog(false);
                  navigate('/features');
                }}
                className="flex-1"
              >
                Go Back to Features
              </Button>
              <Button 
                onClick={() => setShowRewardDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Try Another Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunZone;
