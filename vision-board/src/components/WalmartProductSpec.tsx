import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  DollarSign, 
  Truck, 
  FileText, 
  Search,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";

interface WalmartProduct {
  id: string;
  lastUpdated: string;
  status: string;
  basicInfo: {
    sku: string;
    upc: string;
    brand: string;
    productName: string;
  };
  seoOptimized: {
    productTitle: string;
    shortDescription: string;
    keyFeatures: string[];
    searchTerms: string[];
  };
  pricing: {
    msrp: number;
    sellingPrice: number;
    costPrice: number;
  };
}

const initialProduct: WalmartProduct = {
  id: "womens-balance-001",
  lastUpdated: "2026-01-05",
  status: "draft",
  basicInfo: {
    sku: "52274-401",
    upc: "783325397399",
    brand: "Success Chemistry",
    productName: "Women's Balance",
  },
  seoOptimized: {
    productTitle: "Success Chemistry Women's Balance - Female Vitality & Arousal Support Supplement with Maca, Ashwagandha, Tribulus & Ginseng - 60 Capsules",
    shortDescription: "Premium women's wellness supplement featuring a powerful blend of Maca Root, Ashwagandha, Tribulus, and Asian Ginseng to support healthy arousal, energy, and hormonal balance.",
    keyFeatures: [
      "SUPPORTS AROUSAL & RESPONSE - Specially formulated blend of Maca, Tribulus, and Ashwagandha",
      "ENHANCED ABSORPTION - Contains patented BioPerine (Black Pepper Extract)",
      "HORMONAL BALANCE SUPPORT - Features Dong Quai, Damiana, and Asian Ginseng",
      "ENERGY & VITALITY BOOST - B-Vitamin complex (B6, B12) plus Zinc and L-Arginine",
      "PREMIUM QUALITY - Made in USA, 60 vegetable capsules, 30-day supply"
    ],
    searchTerms: [
      "womens libido supplement",
      "female arousal pills",
      "maca root for women",
      "ashwagandha women supplement",
      "tribulus for women",
    ],
  },
  pricing: {
    msrp: 29.99,
    sellingPrice: 24.99,
    costPrice: 8.50,
  }
};

export default function WalmartProductSpec() {
  const [product] = useState<WalmartProduct>(initialProduct);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("seo");

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sections = [
    { id: "seo", label: "SEO Content", icon: Search },
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing", icon: DollarSign },
  ];

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <Button
      size="icon"
      variant="ghost"
      className="h-6 w-6 text-gray-400 hover:text-emerald-400"
      onClick={() => copyToClipboard(text, fieldName)}
    >
      {copiedField === fieldName ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Walmart Product Spec Sheet
          </h2>
          <p className="text-sm text-gray-400 mt-1">SEO-optimized product listings for Walmart Marketplace</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            size="sm"
            className={activeSection === section.id 
              ? "bg-emerald-600 text-white" 
              : "border-gray-700 text-gray-300 hover:border-emerald-600"}
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon className="w-4 h-4 mr-2" />
            {section.label}
          </Button>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-emerald-900/50 p-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white">{product.basicInfo.productName}</h3>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                {product.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{product.basicInfo.brand} | SKU: {product.basicInfo.sku}</p>
            <p className="text-xs text-gray-500">Last updated: {product.lastUpdated}</p>
          </div>
        </div>

        {activeSection === "seo" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-400">Product Title (SEO Optimized)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{product.seoOptimized.productTitle.length}/200 chars</span>
                  <CopyButton text={product.seoOptimized.productTitle} fieldName="title" />
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-white text-sm">{product.seoOptimized.productTitle}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-400">Short Description</label>
                <CopyButton text={product.seoOptimized.shortDescription} fieldName="shortDesc" />
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-gray-300 text-sm">{product.seoOptimized.shortDescription}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-400">Key Features (Bullet Points)</label>
                <CopyButton text={product.seoOptimized.keyFeatures.join("\n")} fieldName="features" />
              </div>
              <div className="space-y-2">
                {product.seoOptimized.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-slate-800/50 rounded border border-slate-700">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-gray-300 text-sm">{feature}</p>
                    <CopyButton text={feature} fieldName={`feature-${index}`} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-400">Search Terms</label>
                <CopyButton text={product.seoOptimized.searchTerms.join(", ")} fieldName="searchTerms" />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.seoOptimized.searchTerms.map((term, index) => (
                  <Badge 
                    key={index} 
                    className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 cursor-pointer hover:bg-cyan-500/30"
                    onClick={() => copyToClipboard(term, `term-${index}`)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.basicInfo).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div>
                  <p className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-white text-sm">{value}</p>
                </div>
                <CopyButton text={value} fieldName={`basic-${key}`} />
              </div>
            ))}
          </div>
        )}

        {activeSection === "pricing" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">MSRP</p>
              <p className="text-2xl font-bold text-white">${product.pricing.msrp}</p>
            </div>
            <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-700 text-center">
              <p className="text-xs text-emerald-400 uppercase mb-1">Selling Price</p>
              <p className="text-2xl font-bold text-emerald-400">${product.pricing.sellingPrice}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Cost</p>
              <p className="text-2xl font-bold text-amber-400">${product.pricing.costPrice}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
