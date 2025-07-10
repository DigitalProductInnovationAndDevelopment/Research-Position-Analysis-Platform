import { useState } from "react";
import { BarChart3, Search, Target, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Clustering = () => {
  const [keyword, setKeyword] = useState("artificial intelligence");

  // Mock data for topic clustering
  const clusters = [
    {
      id: 1,
      name: "Machine Learning Applications",
      topics: ["supervised learning", "unsupervised learning", "reinforcement learning", "deep learning"],
      publications: 1250,
      color: "hsl(var(--chart-blue))",
      center: { x: 30, y: 40 }
    },
    {
      id: 2,
      name: "Computer Vision",
      topics: ["image recognition", "object detection", "image segmentation", "face recognition"],
      publications: 890,
      color: "hsl(var(--chart-purple))",
      center: { x: 70, y: 60 }
    },
    {
      id: 3,
      name: "Natural Language Processing",
      topics: ["text analysis", "sentiment analysis", "language models", "machine translation"],
      publications: 750,
      color: "hsl(var(--chart-teal))",
      center: { x: 50, y: 20 }
    },
    {
      id: 4,
      name: "Robotics & Automation",
      topics: ["autonomous systems", "robot control", "motion planning", "human-robot interaction"],
      publications: 540,
      color: "hsl(var(--chart-orange))",
      center: { x: 20, y: 80 }
    },
    {
      id: 5,
      name: "AI Ethics & Safety",
      topics: ["algorithmic bias", "explainable AI", "AI governance", "fairness in AI"],
      publications: 420,
      color: "hsl(var(--chart-green))",
      center: { x: 80, y: 30 }
    }
  ];

  const scatterData = clusters.map(cluster => ({
    x: cluster.center.x,
    y: cluster.center.y,
    z: cluster.publications,
    name: cluster.name,
    color: cluster.color
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Topic Clustering
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore related research topics grouped by semantic similarity
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Topic Analysis
            </CardTitle>
            <CardDescription>
              Enter a research topic to discover related clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter topic (e.g., artificial intelligence, quantum computing...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <Button className="h-12 px-8 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
                <Target className="h-4 w-4 mr-2" />
                Cluster
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clustering Visualization */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-chart-blue" />
              Topic Clusters for "{keyword}"
            </CardTitle>
            <CardDescription>
              Semantic similarity visualization of related research topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Semantic Dimension 1"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Semantic Dimension 2"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'z') return [`${value} publications`, 'Publications'];
                    return [value, name];
                  }}
                />
                <Scatter name="Topic Clusters" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cluster Details */}
        <div className="grid lg:grid-cols-2 gap-6">
          {clusters.map((cluster, index) => (
            <Card 
              key={cluster.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cluster.color }}
                    ></div>
                    <CardTitle className="text-lg">{cluster.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {cluster.publications} publications
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">Related Topics:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cluster.topics.map((topic) => (
                      <Badge 
                        key={topic} 
                        variant="outline" 
                        className="bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                        style={{ borderColor: cluster.color }}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="border-0 bg-gradient-to-br from-chart-blue/10 to-chart-blue/5 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-blue mb-2">{clusters.length}</div>
              <div className="text-sm text-muted-foreground">Topic Clusters</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-purple/10 to-chart-purple/5 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-purple mb-2">
                {clusters.reduce((sum, cluster) => sum + cluster.topics.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Related Topics</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-teal/10 to-chart-teal/5 animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-teal mb-2">
                {clusters.reduce((sum, cluster) => sum + cluster.publications, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Publications</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-orange/10 to-chart-orange/5 animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-orange mb-2">0.87</div>
              <div className="text-sm text-muted-foreground">Avg. Similarity</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clustering;