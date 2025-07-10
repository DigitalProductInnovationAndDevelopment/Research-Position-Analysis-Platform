import { useState } from "react";
import { TrendingUp, Search, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Trends = () => {
  const [keyword, setKeyword] = useState("machine learning");

  // Mock data for trend visualization
  const trendData = [
    { year: 2018, publications: 1240, citations: 12400 },
    { year: 2019, publications: 1680, citations: 18900 },
    { year: 2020, publications: 2150, citations: 28600 },
    { year: 2021, publications: 2890, citations: 41200 },
    { year: 2022, publications: 3420, citations: 58700 },
    { year: 2023, publications: 4120, citations: 78900 },
  ];

  const relatedKeywords = [
    { keyword: "deep learning", growth: 156, publications: 2890 },
    { keyword: "neural networks", growth: 134, publications: 2340 },
    { keyword: "artificial intelligence", growth: 98, publications: 1890 },
    { keyword: "computer vision", growth: 187, publications: 1560 },
    { keyword: "natural language processing", growth: 145, publications: 1340 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Topic Trends
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze publication frequency and trends over time for research topics
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Keyword Analysis
            </CardTitle>
            <CardDescription>
              Enter a research topic to visualize its publication trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter keyword (e.g., machine learning, quantum computing...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <Button className="h-12 px-8 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trends Visualization */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-blue" />
                Publication Trends
              </CardTitle>
              <CardDescription>
                Number of publications for "{keyword}" over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="year" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="publications" 
                    stroke="hsl(var(--chart-blue))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-blue))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--chart-blue))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-purple" />
                Citation Impact
              </CardTitle>
              <CardDescription>
                Total citations for "{keyword}" publications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="year" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="citations" 
                    fill="hsl(var(--chart-purple))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Related Keywords */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>Related Trending Keywords</CardTitle>
            <CardDescription>
              Similar research topics with growth trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedKeywords.map((item, index) => (
                <div 
                  key={item.keyword} 
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg capitalize">{item.keyword}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.publications.toLocaleString()} publications
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${item.growth > 150 ? 'text-chart-green' : item.growth > 120 ? 'text-chart-orange' : 'text-chart-blue'}`}>
                      +{item.growth}%
                    </div>
                    <div className="text-sm text-muted-foreground">growth</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Insights */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 bg-gradient-to-br from-chart-blue/10 to-chart-blue/5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-blue mb-2">232%</div>
              <div className="text-sm text-muted-foreground">Growth since 2018</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-purple/10 to-chart-purple/5 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-purple mb-2">4.12K</div>
              <div className="text-sm text-muted-foreground">Publications in 2023</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-teal/10 to-chart-teal/5 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-teal mb-2">636%</div>
              <div className="text-sm text-muted-foreground">Citation growth</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trends;