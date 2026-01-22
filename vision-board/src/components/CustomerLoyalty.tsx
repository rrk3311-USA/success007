import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Mail, MessageSquare, Send, CheckCircle, Circle, Clock, Users, Zap, Target } from "lucide-react";

interface CampaignTask {
  id: string;
  title: string;
  description: string;
  channel: "email" | "sms" | "whatsapp";
  status: "pending" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
}

const campaignTasks: CampaignTask[] = [
  {
    id: "welcome-email",
    title: "Welcome Email Sequence",
    description: "Set up 5-email welcome series for new customers",
    channel: "email",
    status: "pending",
    priority: "high",
  },
  {
    id: "reorder-reminder",
    title: "Reorder Reminder Flow",
    description: "30/60/90 day automated reorder reminders",
    channel: "email",
    status: "pending",
    priority: "high",
  },
  {
    id: "review-request",
    title: "Review Request Automation",
    description: "Ask for reviews 7 days after delivery",
    channel: "email",
    status: "pending",
    priority: "medium",
  },
  {
    id: "vip-sms",
    title: "VIP SMS Alerts",
    description: "Exclusive early access texts for top customers",
    channel: "sms",
    status: "pending",
    priority: "medium",
  },
  {
    id: "whatsapp-support",
    title: "WhatsApp Support Channel",
    description: "Set up WhatsApp Business for customer support",
    channel: "whatsapp",
    status: "pending",
    priority: "low",
  },
  {
    id: "abandoned-cart",
    title: "Abandoned Cart Recovery",
    description: "Multi-channel abandoned cart recovery sequence",
    channel: "email",
    status: "pending",
    priority: "high",
  },
  {
    id: "birthday-campaign",
    title: "Birthday/Anniversary Campaign",
    description: "Special offers on customer milestones",
    channel: "email",
    status: "pending",
    priority: "low",
  },
  {
    id: "winback-campaign",
    title: "Win-Back Campaign",
    description: "Re-engage customers who haven't purchased in 90+ days",
    channel: "email",
    status: "pending",
    priority: "medium",
  },
];

export default function CustomerLoyalty() {
  const [tasks, setTasks] = useState<CampaignTask[]>(campaignTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
        : task
    ));
  };

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const progress = (completedCount / tasks.length) * 100;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <MessageSquare className="w-4 h-4" />;
      case "whatsapp": return <MessageSquare className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-400/30 bg-red-400/10";
      case "medium": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "low": return "text-green-400 border-green-400/30 bg-green-400/10";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress": return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900/50 border-emerald-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-400">
              <Target className="w-4 h-4" />
              Campaign Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{completedCount} of {tasks.length} tasks</span>
                <span className="font-medium text-white">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-emerald-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyan-400">
              <Users className="w-4 h-4" />
              Channels Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 border-emerald-700 text-emerald-400">
                <Mail className="w-3 h-3" /> Email
              </Badge>
              <Badge variant="outline" className="gap-1 border-cyan-700 text-cyan-400">
                <MessageSquare className="w-3 h-3" /> SMS
              </Badge>
              <Badge variant="outline" className="gap-1 border-purple-700 text-purple-400">
                <MessageSquare className="w-3 h-3" /> WhatsApp
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-emerald-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs border-emerald-700 text-emerald-400">
                Setup Klaviyo
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-cyan-700 text-cyan-400">
                Connect Twilio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-emerald-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Send className="w-5 h-5" />
            Customer Loyalty Campaign Setup
          </CardTitle>
          <CardDescription>
            Track your email, SMS, and WhatsApp automation setup progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  task.status === "completed" 
                    ? "bg-emerald-900/20 border-emerald-700/50" 
                    : "bg-slate-800/30 border-slate-700/50 hover:border-emerald-700/50"
                }`}
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-white"}`}>
                      {task.title}
                    </span>
                    <Badge variant="outline" className="gap-1 text-xs border-cyan-700 text-cyan-400">
                      {getChannelIcon(task.channel)}
                      {task.channel}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className={`text-sm mt-1 ${task.status === "completed" ? "text-gray-500" : "text-gray-400"}`}>
                    {task.description}
                  </p>
                </div>
                {getStatusIcon(task.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
