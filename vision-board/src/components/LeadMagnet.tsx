import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Mail, CheckCircle } from "lucide-react";

const infographics = [
  { id: "eye-health", title: "Eye Health Guide", description: "Complete guide to maintaining healthy vision", downloads: 342 },
  { id: "supplement-guide", title: "Supplement Basics", description: "Understanding vitamins and supplements", downloads: 521 },
  { id: "wellness-tips", title: "Daily Wellness Tips", description: "10 habits for better health", downloads: 289 },
];

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [selectedInfographic, setSelectedInfographic] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    setShowSuccess(true);
    setEmail("");
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {infographics.map((info) => (
          <Card
            key={info.id}
            className={`cursor-pointer transition-all hover:border-emerald-500 ${
              selectedInfographic === info.id
                ? "ring-2 ring-emerald-500 bg-emerald-950/30"
                : "bg-slate-900/50 border-emerald-900/50"
            }`}
            onClick={() => setSelectedInfographic(info.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <FileText className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <Badge variant="secondary" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  {info.downloads}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2 text-white">{info.title}</CardTitle>
              <CardDescription className="text-sm">{info.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-emerald-900/50 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Mail className="w-5 h-5" />
            Get Your Free Guide
          </CardTitle>
          <CardDescription>
            Enter your email to receive instant access to our free health guides and tips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div>
                <p className="font-medium text-lg text-white">You're all set!</p>
                <p className="text-gray-400">Check your inbox for your free guide.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowSuccess(false)}
                className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
              >
                Download Another Guide
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Name (optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm text-gray-400 leading-tight">
                  I agree to receive health tips and occasional product updates. Unsubscribe anytime.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4" />
                Get Free Guide
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
