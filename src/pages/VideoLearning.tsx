import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Play, Youtube, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ThemedBackground from '@/components/themed-backgrounds/ThemedBackground';
import PreferencesButton from '@/components/PreferencesButton';
import { searchEducationalVideos, type YouTubeVideo } from '@/services/youtubeService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AudioText from '@/components/AudioText';

const VideoLearning: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, addPoints } = useUserPreferences();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [usingDemoContent, setUsingDemoContent] = useState<boolean>(false);
  
  // Learning path state
  const [isInLearningJourney, setIsInLearningJourney] = useState<boolean>(false);
  const [learningTopic, setLearningTopic] = useState<string>('');
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);
  const [learningPath, setLearningPath] = useState<string[]>([]);

  // Check if we're in a learning journey
  useEffect(() => {
    const storedTopic = sessionStorage.getItem('currentLearningTopic');
    const storedPathIndex = sessionStorage.getItem('currentLearningPathIndex');
    const storedPath = sessionStorage.getItem('currentLearningPath');
    
    if (storedTopic && storedPathIndex && storedPath) {
      setLearningTopic(storedTopic);
      setCurrentPathIndex(parseInt(storedPathIndex, 10));
      setLearningPath(JSON.parse(storedPath));
      setIsInLearningJourney(true);
      
      // Auto-populate search term from learning topic
      if (!searchTerm) {
        setSearchTerm(storedTopic);
      }
    }
  }, [searchTerm]);

  // Filter videos based on active tab
  const filteredVideos = videos.filter(video => {
    if (activeTab === 'all') return true;
    if (activeTab === 'shorts') return video.isShort;
    if (activeTab === 'videos') return !video.isShort;
    return true;
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setIsSearching(true);
    setVideos([]);
    setSelectedVideo(null);
    setUsingDemoContent(false);
    
    try {
      const results = await searchEducationalVideos(searchTerm);
      setVideos(results);
      
      // Check if we're getting demo content by comparing with known good video IDs
      const knownDemoIdPatterns = [
        'JH6wGXxIWpY', 'WT_wvvEvgWI', 'W3VeKUS7i-M', 'mjlySfLnNRY', 'KIKmEv64p1g',  // Math
        'u2vlD2JMAcw', 'LhNhX-nmgFQ', 'AYch4P0wEWY', 'dKgJaa-snEY', 'XQA8BXxOTXU',  // Science
        'BELlZKpi1Zs', '4SYuWxXjs7A', 'CuJDgJft0OQ', 'EXZx43pVoxo', 'Qw6OVlDmvCU'   // General
      ];
      
      if (results.length > 0 && knownDemoIdPatterns.includes(results[0].id)) {
        setUsingDemoContent(true);
      }
      
      if (results.length === 0) {
        toast.info('No videos found for your search. Try a different topic!');
      } else {
        addPoints(5);
        toast.success(`Found ${results.length} learning videos! +5 points`, {
          description: 'Watch videos to learn about ' + searchTerm
        });
      }
    } catch (error) {
      console.error('Failed to search videos:', error);
      toast.error('Failed to search videos. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    addPoints(10);
    toast.success('Enjoy learning! +10 points', {
      description: 'Learning through videos is fun and effective'
    });
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const goBack = () => {
    navigate('/home');
  };
  
  const continueToNextActivity = () => {
    // Update the current path index in sessionStorage
    const nextIndex = currentPathIndex + 1;
    
    if (nextIndex < learningPath.length) {
      sessionStorage.setItem('currentLearningPathIndex', nextIndex.toString());
      navigate(learningPath[nextIndex]);
    } else {
      // We've completed the learning journey
      sessionStorage.removeItem('currentLearningTopic');
      sessionStorage.removeItem('currentLearningPath');
      sessionStorage.removeItem('currentLearningPathIndex');
      
      // Add extra points for completing a full learning journey
      addPoints(25);
      toast.success('Learning journey complete! +25 bonus points', {
        description: 'You\'ve completed all activities in your learning path!'
      });
      
      // Navigate back to home
      navigate('/home');
    }
  };
  
  const getNextActivityName = () => {
    if (currentPathIndex + 1 >= learningPath.length) {
      return 'Complete Journey';
    }
    
    const nextPath = learningPath[currentPathIndex + 1];
    switch(nextPath) {
      case '/exercises/balloons': return '🎈 Balloon Math Exercise';
      case '/image-to-learning': return '📸 Image Learning';
      case '/real-life-practice': return '✏️ Real Life Practice';
      case '/video-learning': return '🎥 Video Learning';
      default: return 'Next Activity';
    }
  };

  // Trigger search automatically if we're in a learning journey and have a topic
  useEffect(() => {
    if (isInLearningJourney && learningTopic && !videos.length && !isSearching) {
      handleSearch();
    }
  }, [isInLearningJourney, learningTopic, videos.length]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative">
      {/* Themed animated background */}
      <ThemedBackground theme={preferences.theme} />
      
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 hover:bg-white/90 shadow-sm flex items-center" 
                onClick={goBack}
              >
                <Home className="h-4 w-4 mr-1.5" /> Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Youtube className="h-6 w-6 text-red-500" />
                {isInLearningJourney ? `🎥 Video Learning: ${learningTopic}` : 'Video Learning'}
              </h1>
            </div>
            
            <PreferencesButton />
          </div>
          
          {/* Learning Journey Progress - show only if in a learning journey */}
          {isInLearningJourney && (
            <div className="mb-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">Learning Journey: {learningTopic}</h2>
                <AudioText text={`Learning Journey: ${learningTopic}. You are on step ${currentPathIndex + 1} of ${learningPath.length}.`} className="ml-1" />
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${Math.round(((currentPathIndex + 1) / learningPath.length) * 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Step {currentPathIndex + 1} of {learningPath.length}
                </span>
                
                <Button 
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm hover:shadow-md"
                  onClick={continueToNextActivity}
                >
                  Continue to {getNextActivityName()} →
                </Button>
              </div>
            </div>
          )}
        </header>
        
        <motion.div 
          className="w-full max-w-3xl mx-auto mb-8 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <label className="text-lg font-medium">
                  What do you want to learn with videos today?
                </label>
                
                <div className="flex gap-2">
                  <Input 
                    type="text"
                    placeholder="Example: math addition, dinosaurs, planets, coding for kids..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    disabled={isSearching}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isSearching || !searchTerm.trim()}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  We'll find safe, educational videos perfect for your learning journey!
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Demo content alert */}
        {usingDemoContent && videos.length > 0 && (
          <motion.div 
            className="w-full max-w-3xl mx-auto mb-4 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="info" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Demo Mode</AlertTitle>
              <AlertDescription className="text-blue-600">
                We're currently showing demonstration videos instead of live YouTube results. 
                These are still great educational videos that match your search!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {/* Video player modal */}
        {selectedVideo && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-semibold truncate mr-2">{selectedVideo.title}</h3>
                <Button variant="ghost" size="sm" onClick={closeVideo}>
                  Close
                </Button>
              </div>
              
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                ></iframe>
              </div>
              
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-1">
                  Channel: {selectedVideo.channelTitle}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Video results */}
        {videos.length > 0 && (
          <motion.div 
            className="flex-1 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg mb-8">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All ({videos.length})</TabsTrigger>
                    <TabsTrigger value="shorts">
                      Shorts ({videos.filter(v => v.isShort).length})
                    </TabsTrigger>
                    <TabsTrigger value="videos">
                      Videos ({videos.filter(v => !v.isShort).length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="p-4">
                  <VideoGrid videos={filteredVideos} onPlayVideo={handlePlayVideo} />
                </TabsContent>
                
                <TabsContent value="shorts" className="p-4">
                  <VideoGrid videos={filteredVideos} onPlayVideo={handlePlayVideo} />
                </TabsContent>
                
                <TabsContent value="videos" className="p-4">
                  <VideoGrid videos={filteredVideos} onPlayVideo={handlePlayVideo} />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
        
        {isSearching && (
          <div className="flex-1 flex flex-col items-center justify-center z-10">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-gray-700">Searching for educational videos...</p>
          </div>
        )}
        
        {!isSearching && videos.length === 0 && searchTerm && (
          <div className="flex-1 flex flex-col items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 text-center max-w-lg">
              <Youtube className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any educational videos for "{searchTerm}".
                Try a different search term or check your internet connection.
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Try a Different Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface VideoGridProps {
  videos: YouTubeVideo[];
  onPlayVideo: (video: YouTubeVideo) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onPlayVideo }) => {
  // Handle image loading errors by providing fallbacks
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const videoId = img.getAttribute('data-video-id');
    if (videoId) {
      // Try different YouTube thumbnail URL formats
      if (img.src.includes('maxresdefault')) {
        img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      } else if (img.src.includes('hqdefault')) {
        img.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
      } else if (img.src.includes('mqdefault')) {
        img.src = `https://i.ytimg.com/vi/${videoId}/default.jpg`;
      } else {
        // Final fallback - use a placeholder image
        img.src = 'https://placehold.co/480x360/e4e4e7/a1a1aa?text=Video';
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <motion.div 
          key={video.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => onPlayVideo(video)}
        >
          <Card className="overflow-hidden h-full flex flex-col hover:border-primary transition-colors">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full aspect-video object-cover"
                data-video-id={video.id}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-2">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              </div>
              {video.isShort && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  Short
                </Badge>
              )}
            </div>
            <CardContent className="p-3 flex-1 flex flex-col">
              <h3 className="font-medium line-clamp-2 mb-1">{video.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mt-auto">
                {video.channelTitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoLearning; 