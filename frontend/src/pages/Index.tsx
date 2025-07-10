import { Link } from "react-router-dom";
import { Search, TrendingUp, Network, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DisclaimerBox from "../../about/DisclaimerBox";
import PrivacyPolicyBox from "../../about/PrivacyPolicyBox";
import ImpressumBox from "../../about/ImpressumBox";

const Index = () => {
  const features = [
    {
      title: "Keyword Search & Filtering",
      description: "Search publications with advanced filters by year, affiliation, and more",
      icon: Search,
      link: "/search",
      gradient: "from-chart-blue to-chart-purple"
    },
    {
      title: "Topic Trends",
      description: "Visualize publication frequency over time for emerging research topics",
      icon: TrendingUp,
      link: "/trends",
      gradient: "from-chart-purple to-chart-teal"
    },
    {
      title: "Topic Clustering",
      description: "Explore related topics grouped by semantic similarity",
      icon: BarChart3,
      link: "/clustering",
      gradient: "from-chart-teal to-chart-orange"
    },
    {
      title: "Collaboration Graph",
      description: "Analyze institutional research networks and partnerships",
      icon: Network,
      link: "/collaboration",
      gradient: "from-chart-orange to-chart-green"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-3 animate-glow" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SPARK
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive research publication analysis platform for discovering trends, 
              collaborations, and emerging topics in academic literature
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                <Link to="/search">Start Exploring</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5" asChild>
                <Link to="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Analysis Tools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to analyze research publications, track trends, and discover collaborations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-4 rounded-full bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-primary/10 to-primary-glow/10 hover:from-primary/20 hover:to-primary-glow/20 text-primary border-primary/20"
                    variant="outline"
                  >
                    <Link to={feature.link}>
                      Explore
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <DisclaimerBox />
          <PrivacyPolicyBox />
          <ImpressumBox />
        </div>
      </section>
    </div>
  );
};

export default Index;