import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import CustomerAnalytics from "@/components/CustomerAnalytics";
import LeadMagnet from "@/components/LeadMagnet";
import CustomerLoyalty from "@/components/CustomerLoyalty";
import WalmartProductSpec from "@/components/WalmartProductSpec";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import AppFooter from "@/components/layout/AppFooter";
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Shield,
  Clock,
  Eye,
  DollarSign,
  Trophy,
  Brain,
  Heart,
  Sun,
  Droplets,
  HeartPulse,
  X,
  Milestone,
  Zap,
  Crosshair,
  LayoutGrid,
  Dumbbell,
  Stethoscope,
  TrendingUp,
  Award,
  Star,
  Code,
  Palette,
  Users,
  Terminal,
  FileCode,
  Save,
  Store,
  Mail,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VisionPhoto {
  id: string;
  url: string;
  caption: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface ProjectMilestone {
  id: string;
  name: string;
  progress: number;
  milestones: { id: string; text: string; completed: boolean }[];
}

export default function LifeVisionBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("command");
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [weather] = useState({ temp: 72, unit: "°F" });
  const [battery] = useState({ level: "B+", status: "charging" });
  
  const [weeklyMantra] = useState({
    code: "OPERATION PHOENIX",
    mission: "Build the empire. Execute with precision. Leave no opportunity unexplored.",
    classification: "EYES ONLY"
  });

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Morning meditation - 20 min", completed: true, priority: "high" },
    { id: "2", text: "Review weekly goals", completed: false, priority: "high" },
    { id: "3", text: "Gym session - strength training", completed: false, priority: "medium" },
    { id: "4", text: "Read 30 pages", completed: false, priority: "low" },
    { id: "5", text: "Call family", completed: false, priority: "medium" },
  ]);
  const [newTodo, setNewTodo] = useState("");
  
  const [projects, setProjects] = useState<ProjectMilestone[]>([
    {
      id: "1",
      name: "OPERATION: TIKTOK AFFILIATE",
      progress: 25,
      milestones: [
        { id: "1a", text: "Account setup & verification", completed: true },
        { id: "1b", text: "Product catalog integration", completed: false },
        { id: "1c", text: "Content strategy deployment", completed: false },
        { id: "1d", text: "Affiliate revenue scaling", completed: false },
      ]
    },
    {
      id: "2", 
      name: "PROJECT: SHOPPABLE MERCHANT VIDEOS",
      progress: 0,
      milestones: [
        { id: "2a", text: "CEO account establishment", completed: false },
        { id: "2b", text: "Video commerce setup", completed: false },
        { id: "2c", text: "Product tagging system", completed: false },
        { id: "2d", text: "Launch & monetization", completed: false },
      ]
    },
    {
      id: "3",
      name: "INITIATIVE: AI CONSULTING",
      progress: 0,
      milestones: [
        { id: "3a", text: "AI SaaS package design", completed: false },
        { id: "3b", text: "Served dashboard build", completed: false },
        { id: "3c", text: "Compute & cost packaging", completed: false },
        { id: "3d", text: "Client management system", completed: false },
      ]
    }
  ]);

  const [visionPhotos, setVisionPhotos] = useState<VisionPhoto[]>([
    { id: "1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", caption: "DESTINATION: SUMMIT" },
    { id: "2", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop", caption: "ASSET: ACQUIRED" },
    { id: "3", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop", caption: "BASE: ESTABLISHED" },
    { id: "4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", caption: "MINDSET: FOCUSED" },
    { id: "5", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop", caption: "OBJECTIVE: FREEDOM" },
    { id: "6", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop", caption: "MISSION: STRENGTH" },
  ]);

  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  const [editorCode, setEditorCode] = useState("");
  const [selectedFile, setSelectedFile] = useState("LifeVisionBoard.tsx");
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const [fitnessGoals] = useState([
    { id: "1", name: "Weekly Workouts", current: 4, target: 5, unit: "sessions" },
    { id: "2", name: "Daily Steps", current: 8500, target: 10000, unit: "steps" },
    { id: "3", name: "Water Intake", current: 6, target: 8, unit: "glasses" },
    { id: "4", name: "Sleep Hours", current: 7, target: 8, unit: "hours" },
  ]);

  const [incomeStreams, setIncomeStreams] = useState([
    { id: "1", name: "Success Chemistry E-commerce", amount: 15000, type: "active", status: "growing" },
    { id: "2", name: "TikTok Affiliate Revenue", amount: 2500, type: "passive", status: "building" },
    { id: "3", name: "AI Consulting Packages", amount: 0, type: "active", status: "building" },
    { id: "4", name: "Walmart Marketplace", amount: 8000, type: "active", status: "stable" },
    { id: "5", name: "Amazon Sales", amount: 12000, type: "active", status: "growing" },
  ]);

  const [achievements, setAchievements] = useState([
    { id: "1", name: "First Blood", description: "Launched first product successfully", unlocked: true, date: "2024-01", icon: "trophy" },
    { id: "2", name: "Empire Builder", description: "Reached $10K monthly revenue", unlocked: true, date: "2024-06", icon: "award" },
    { id: "3", name: "Multi-Platform", description: "Active on 3+ marketplaces", unlocked: true, date: "2024-09", icon: "star" },
    { id: "4", name: "AI Pioneer", description: "Launch AI consulting service", unlocked: false, icon: "zap" },
    { id: "5", name: "Six Figures", description: "Reach $100K annual revenue", unlocked: false, icon: "award" },
  ]);

  const [skills, setSkills] = useState([
    { id: "1", name: "E-commerce", level: 85, maxLevel: 100, category: "business" },
    { id: "2", name: "Marketing", level: 75, maxLevel: 100, category: "business" },
    { id: "3", name: "Negotiation", level: 70, maxLevel: 100, category: "business" },
    { id: "4", name: "AI/Automation", level: 68, maxLevel: 100, category: "tech" },
    { id: "5", name: "Web Development", level: 45, maxLevel: 100, category: "tech" },
    { id: "6", name: "Data Analysis", level: 55, maxLevel: 100, category: "tech" },
    { id: "7", name: "Content Creation", level: 65, maxLevel: 100, category: "creative" },
    { id: "8", name: "Video Production", level: 50, maxLevel: 100, category: "creative" },
    { id: "9", name: "Leadership", level: 70, maxLevel: 100, category: "social" },
    { id: "10", name: "Networking", level: 75, maxLevel: 100, category: "social" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('visionBoardData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.todos) setTodos(data.todos);
        if (data.visionPhotos) setVisionPhotos(data.visionPhotos);
        if (data.projects) setProjects(data.projects);
        if (data.incomeStreams) setIncomeStreams(data.incomeStreams);
        if (data.achievements) setAchievements(data.achievements);
        if (data.skills) setSkills(data.skills);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      todos,
      visionPhotos,
      projects,
      incomeStreams,
      achievements,
      skills
    };
    localStorage.setItem('visionBoardData', JSON.stringify(dataToSave));
  }, [todos, visionPhotos, projects, incomeStreams, achievements, skills]);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false, priority: "medium" }]);
    setNewTodo("");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      return { ...p, milestones: updatedMilestones, progress: newProgress };
    }));
  };

  const addPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setVisionPhotos([...visionPhotos, { 
      id: Date.now().toString(), 
      url: newPhotoUrl, 
      caption: newPhotoCaption || "NEW TARGET" 
    }]);
    setNewPhotoUrl("");
    setNewPhotoCaption("");
    setShowAddPhoto(false);
  };

  const deletePhoto = (id: string) => {
    setVisionPhotos(visionPhotos.filter(p => p.id !== id));
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalProgress = Math.round((completedTodos / todos.length) * 100);
  const totalIncome = incomeStreams.reduce((acc, s) => acc + s.amount, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-400/50";
      case "medium": return "text-amber-400 border-amber-400/50";
      case "low": return "text-emerald-400 border-emerald-400/50";
      default: return "text-gray-400 border-gray-400/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "growing": return "text-emerald-400";
      case "stable": return "text-cyan-400";
      case "building": return "text-amber-400";
      default: return "text-gray-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business": return "from-amber-500 to-orange-500";
      case "tech": return "from-cyan-500 to-blue-500";
      case "creative": return "from-purple-500 to-pink-500";
      case "social": return "from-emerald-500 to-teal-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "business": return DollarSign;
      case "tech": return Code;
      case "creative": return Palette;
      case "social": return Users;
      default: return Brain;
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "trophy": return Trophy;
      case "award": return Award;
      case "star": return Star;
      case "zap": return Zap;
      default: return Trophy;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Admin Layout Structure */}
      <AppHeader 
        sidebarToggled={sidebarToggled}
        onSidebarToggle={() => setSidebarToggled(!sidebarToggled)}
      />
      
      <AppSidebar
        isToggled={sidebarToggled}
        isCollapsed={sidebarCollapsed}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-300 ${
          sidebarToggled ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
        }`}
        style={{ marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'command' && 'Command Center'}
              {activeTab === 'health' && 'Health Dashboard'}
              {activeTab === 'income' && 'Income Overview'}
              {activeTab === 'achievements' && 'Achievements'}
              {activeTab === 'skills' && 'Skills Development'}
              {activeTab === 'romance' && 'Relationship Goals'}
              {activeTab === 'customers' && 'Customer Analytics'}
              {activeTab === 'infographics' && 'Infographics'}
              {activeTab === 'loyalty' && 'Customer Loyalty'}
              {activeTab === 'terminal' && 'Code Terminal'}
              {activeTab === 'walmart' && 'Walmart Integration'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your life vision and track your progress
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Mission Banner */}
            {activeTab === 'command' && (
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 tracking-widest">
                      {weeklyMantra.classification}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crosshair className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      {weeklyMantra.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{weeklyMantra.mission}"
                  </p>
                </div>
              </Card>
            )}

            {/* Tab Content */}
            <div className="space-y-6">
            {activeTab === 'command' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 order-2 lg:order-1">
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vision Matrix</h2>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          onClick={() => setShowAddPhoto(true)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Target
                        </Button>
                      </div>
                    </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      <AnimatePresence>
                        {visionPhotos.map((photo, index) => (
                          <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all shadow-sm"
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.caption}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <div className="flex items-center gap-2">
                                <Crosshair className="w-3 h-3 text-blue-400" />
                                <span className="text-xs font-mono text-blue-400 tracking-wider">{photo.caption}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => deletePhoto(photo.id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/80 rounded text-[10px] font-mono text-blue-400 border border-blue-500/50">
                              TARGET-{String(index + 1).padStart(2, '0')}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>

                  <Card className="mt-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Milestone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Operations</h2>
                      </div>
                    </div>
                  
                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{project.name}</span>
                          </div>
                          <Badge variant="outline" className="border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400">
                            {project.progress}% Complete
                          </Badge>
                        </div>
                        
                        <Progress value={project.progress} className="h-2 mb-4 bg-gray-200 dark:bg-gray-700" />
                        
                        <div className="grid grid-cols-2 gap-2">
                          {project.milestones.map((milestone) => (
                            <button
                              key={milestone.id}
                              onClick={() => toggleMilestone(project.id, milestone.id)}
                              className={`flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
                                milestone.completed 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                              )}
                              <span className={milestone.completed ? 'line-through opacity-70' : ''}>
                                {milestone.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

                <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Ops</h2>
                        </div>
                        <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{completedTodos}/{todos.length}</span>
                      </div>
                    </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Mission Progress</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">{totalProgress}%</span>
                      </div>
                      <Progress value={totalProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="flex gap-2 mb-4">
                      <Input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                        placeholder="New objective..."
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={addTodo}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                      <AnimatePresence>
                        {todos.map((todo) => (
                          <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              todo.completed 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                            }`}
                          >
                            <button 
                              onClick={() => toggleTodo(todo.id)}
                              className="flex-shrink-0"
                            >
                              {todo.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm ${todo.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                {todo.text}
                              </span>
                            </div>
                            <Badge variant="outline" className={`text-[10px] px-1.5 ${getPriorityColor(todo.priority)}`}>
                              {todo.priority.toUpperCase()}
                            </Badge>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>

                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Intel</h2>
                      </div>
                    </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active Targets</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">{visionPhotos.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Operations</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">{projects.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <span className="text-sm text-blue-600 dark:text-blue-400">Status</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </Card>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-4 border-b border-emerald-900/50">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-lg font-semibold tracking-wide text-emerald-400">FITNESS PROTOCOL</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      {fitnessGoals.map((goal) => (
                        <div key={goal.id} className="p-4 bg-slate-800/30 rounded-lg border border-emerald-900/30">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-sm text-gray-300">{goal.name}</span>
                            <span className="text-xs text-emerald-400">
                              {goal.current}/{goal.target} {goal.unit}
                            </span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-3 bg-slate-700" />
                          <div className="mt-2 text-right">
                            <span className="text-xs font-mono text-emerald-400">
                              {Math.round((goal.current / goal.target) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-emerald-900/30">
                      <h3 className="font-mono text-sm text-cyan-400 mb-4">WEEKLY WORKOUT SCHEDULE</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                          <div key={day} className={`p-3 rounded text-center ${i < 4 ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-slate-700/30 border border-slate-600/50'}`}>
                            <span className="text-xs text-gray-400">{day}</span>
                            <div className="mt-2">
                              {i < 4 ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-500 mx-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="bg-gradient-to-br from-red-950/30 to-slate-900/50 border-red-900/50 backdrop-blur">
                  <div className="p-4 border-b border-red-900/50">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-red-400" />
                      <h2 className="text-lg font-semibold tracking-wide text-red-400">MEDICAL PROFILE</h2>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-950/30 rounded-lg border border-red-900/50">
                      <div className="flex items-center gap-3">
                        <Droplets className="w-6 h-6 text-red-400" />
                        <span className="text-gray-300">Blood Type</span>
                      </div>
                      <span className="text-2xl font-bold text-red-400">B+</span>
                    </div>
                    
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vitals Check</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Heart Rate</span>
                          <span className="text-emerald-400 font-mono">72 bpm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Blood Pressure</span>
                          <span className="text-emerald-400 font-mono">120/80</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Supplements</div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>Sclera White (Eye Health)</div>
                        <div>Vitamin D3</div>
                        <div>Omega-3</div>
                      </div>
                    </div>
                  </div>
                </Card>
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
                  <div className="relative p-4 border-b border-amber-900/50">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-semibold tracking-wide text-amber-400">INCOME STREAMS</h2>
                    </div>
                  </div>
                  
                  <div className="relative p-6">
                    <div className="mb-6 p-6 bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 rounded-xl border border-amber-700/50">
                      <div className="text-center">
                        <div className="text-xs text-amber-400/70 uppercase tracking-widest mb-2">Total Monthly Revenue</div>
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                          ${totalIncome.toLocaleString()}
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2 text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">+12% from last month</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {incomeStreams.map((stream) => (
                        <div key={stream.id} className="p-4 bg-slate-800/50 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${stream.status === 'growing' ? 'bg-emerald-400' : stream.status === 'stable' ? 'bg-cyan-400' : 'bg-amber-400'} animate-pulse`} />
                              <span className="font-medium text-gray-200">{stream.name}</span>
                              <Badge variant="outline" className={`text-[10px] ${stream.type === 'passive' ? 'border-purple-500 text-purple-400' : 'border-slate-600 text-gray-400'}`}>
                                {stream.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-xs uppercase ${getStatusColor(stream.status)}`}>{stream.status}</span>
                              <span className="text-xl font-bold text-amber-400">${stream.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="bg-gradient-to-br from-slate-900/50 to-amber-950/30 border-amber-900/50 backdrop-blur">
                  <div className="p-4 border-b border-amber-900/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-semibold tracking-wide text-amber-400">WEALTH METRICS</h2>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-700/50">
                      <div className="text-xs text-emerald-400/70 uppercase mb-1">Active Streams</div>
                      <div className="text-2xl font-bold text-emerald-400">{incomeStreams.filter(s => s.type === 'active').length}</div>
                    </div>
                    <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-700/50">
                      <div className="text-xs text-purple-400/70 uppercase mb-1">Passive Streams</div>
                      <div className="text-2xl font-bold text-purple-400">{incomeStreams.filter(s => s.type === 'passive').length}</div>
                    </div>
                    <div className="p-4 bg-cyan-950/30 rounded-lg border border-cyan-700/50">
                      <div className="text-xs text-cyan-400/70 uppercase mb-1">Annual Projection</div>
                      <div className="text-2xl font-bold text-cyan-400">
                        ${(totalIncome * 12).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.1),transparent_50%)]" />
              <div className="relative p-4 border-b border-yellow-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-semibold tracking-wide text-yellow-400">ACHIEVEMENT VAULT</h2>
                  </div>
                  <Badge variant="outline" className="border-yellow-700 text-yellow-400">
                    {unlockedAchievements}/{achievements.length} UNLOCKED
                  </Badge>
                </div>
              </div>
              
              <div className="relative p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = getAchievementIcon(achievement.icon);
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border transition-all ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-yellow-700/50 hover:border-yellow-500/50' 
                            : 'bg-slate-800/30 border-slate-700/30 opacity-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-yellow-500/20' : 'bg-slate-700/30'}`}>
                            <IconComponent className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-600'}`} />
                          </div>
                          {achievement.unlocked && achievement.date && (
                            <span className="text-[10px] text-yellow-400/70 font-mono">{achievement.date}</span>
                          )}
                        </div>
                        <h3 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-xs ${achievement.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                          {achievement.description}
                        </p>
                        {!achievement.unlocked && (
                          <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Locked</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            )}

            {activeTab === 'skills' && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-4 border-b border-emerald-900/50">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold tracking-wide text-cyan-400">SKILL DEVELOPMENT</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['business', 'tech', 'creative', 'social'].map((category) => {
                    const categorySkills = skills.filter(s => s.category === category);
                    const IconComponent = getCategoryIcon(category);
                    const colorClass = getCategoryColor(category);
                    
                    return (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-8 h-8 bg-gradient-to-br ${colorClass} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-white uppercase text-sm">{category}</h3>
                        </div>
                        <div className="space-y-3">
                          {categorySkills.map((skill) => (
                            <div key={skill.id}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-300">{skill.name}</span>
                                <span className={`text-xs font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
                                  LVL {skill.level}
                                </span>
                              </div>
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                                  style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </Card>
            )}

            {activeTab === 'romance' && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-4 border-b border-pink-900/50">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <h2 className="text-lg font-semibold tracking-wide text-pink-400">RELATIONSHIP GOALS</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-pink-950/20 rounded-lg border border-pink-900/30">
                    <h3 className="text-pink-400 font-semibold mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Connection Goals
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-pink-400 rounded-full" />
                        <span className="text-sm">Weekly date nights</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-pink-400 rounded-full" />
                        <span className="text-sm">Daily quality time</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-pink-400 rounded-full" />
                        <span className="text-sm">Monthly adventures</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-pink-400 rounded-full" />
                        <span className="text-sm">Open communication</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-rose-950/20 rounded-lg border border-rose-900/30">
                    <h3 className="text-rose-400 font-semibold mb-4">Future Vision</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                      <p>Building a partnership based on mutual growth, trust, and shared dreams.</p>
                      <p className="text-rose-400 italic">"Together we rise"</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-slate-800/30 rounded-lg border border-pink-900/30 text-center">
                  <p className="text-gray-400 text-sm">Relationship tracking and milestone features coming soon!</p>
                </div>
              </div>
              </Card>
            )}

            {activeTab === 'customers' && <CustomerAnalytics />}
            {activeTab === 'infographics' && <LeadMagnet />}
            {activeTab === 'loyalty' && <CustomerLoyalty />}

            {activeTab === 'terminal' && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-emerald-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold tracking-wide text-cyan-400">CODE TERMINAL</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.value)}
                      className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-gray-300 rounded text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="LifeVisionBoard.tsx">LifeVisionBoard.tsx</option>
                      <option value="App.tsx">App.tsx</option>
                      <option value="index.css">index.css</option>
                    </select>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        setShowSaveNotification(true);
                        setTimeout(() => setShowSaveNotification(false), 2000);
                      }}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                {showSaveNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 p-2 bg-emerald-900/30 border border-emerald-700 rounded text-sm text-emerald-400 flex items-center gap-2"
                  >
                    <FileCode className="w-4 h-4" />
                    Changes saved! (Note: This is a demo - actual file saving requires backend integration)
                  </motion.div>
                )}
              </div>

              <div className="relative">
                <Editor
                  height="70vh"
                  defaultLanguage="typescript"
                  theme="vs-dark"
                  value={editorCode || `// Welcome to the Code Terminal!\n// Edit your app code directly here\n\n// Example: Modify the weekly mantra\nconst weeklyMantra = {\n  code: "OPERATION PHOENIX",\n  mission: "Build the empire. Execute with precision.",\n  classification: "EYES ONLY"\n};\n\n// Example: Add a new income stream\nconst newStream = {\n  id: "6",\n  name: "YouTube Ad Revenue",\n  amount: 3000,\n  type: "passive",\n  status: "growing"\n};\n\n// Example: Add a new achievement\nconst newAchievement = {\n  id: "9",\n  name: "Code Master",\n  description: "Built custom features in the terminal",\n  unlocked: true,\n  date: "2026-01",\n  icon: "zap"\n};\n\n// Tips:\n// - Use Ctrl+F to search\n// - Use Ctrl+H to find and replace\n// - Full VS Code shortcuts available\n// - Changes are live-editable`}
                  onChange={(value: string | undefined) => setEditorCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                  }}
                />
              </div>

              <div className="p-4 border-t border-emerald-900/50 bg-slate-950/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-cyan-900/20 rounded">
                    <FileCode className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-cyan-400 mb-1">Live Code Editor</h3>
                    <p className="text-xs text-gray-400">
                      This is a Monaco Editor (VS Code engine) running in your browser. 
                      You can edit code with full syntax highlighting, IntelliSense, and keyboard shortcuts.
                      For production use, integrate with a backend API to save changes to actual files.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'walmart' && <WalmartProductSpec />}
          </div>
        </div>

        {/* Footer */}
        <AppFooter />
      </div>

      {showAddPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-emerald-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-emerald-400 mb-4">Add New Target</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                <Input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Caption</label>
                <Input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="TARGET: DESCRIPTION"
                  className="bg-slate-800 border-slate-700 text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={addPhoto}
                  className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Add Target
                </Button>
                <Button
                  onClick={() => setShowAddPhoto(false)}
                  variant="outline"
                  className="bg-slate-700 text-gray-300 hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
