import { useState } from "react";
import { Network, Search, Building2, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Collaboration = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("Siemens");

  const institutions = [
    "Siemens", "MIT", "Stanford University", "Harvard University", "UC Berkeley", 
    "Oxford University", "Cambridge University", "ETH Zurich", "Google Research", "Microsoft Research"
  ];

  // Mock collaboration data
  const collaborations = [
    {
      partner: "MIT",
      publications: 156,
      strength: 92,
      keyAreas: ["AI Research", "Robotics", "Computer Vision"],
      recentProjects: ["Autonomous Manufacturing Systems", "Smart Factory AI"]
    },
    {
      partner: "Stanford University",
      publications: 134,
      strength: 87,
      keyAreas: ["Machine Learning", "IoT", "Digital Twins"],
      recentProjects: ["Industrial IoT Platforms", "Predictive Maintenance AI"]
    },
    {
      partner: "UC Berkeley",
      publications: 98,
      strength: 78,
      keyAreas: ["Sustainable Energy", "Smart Grids", "Optimization"],
      recentProjects: ["Smart Grid Technology", "Energy Management Systems"]
    },
    {
      partner: "ETH Zurich",
      publications: 87,
      strength: 73,
      keyAreas: ["Control Systems", "Automation", "Cybersecurity"],
      recentProjects: ["Industrial Cybersecurity", "Process Automation"]
    },
    {
      partner: "Oxford University",
      publications: 76,
      strength: 69,
      keyAreas: ["Data Analytics", "Decision Systems", "Human Factors"],
      recentProjects: ["Industrial Data Analytics", "Human-Machine Interfaces"]
    }
  ];

  const networkMetrics = {
    totalPartners: 45,
    totalPublications: 1247,
    averageStrength: 78,
    topCollaborations: 5
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return "text-chart-green";
    if (strength >= 70) return "text-chart-orange";
    return "text-chart-blue";
  };

  const getStrengthBadge = (strength: number) => {
    if (strength >= 85) return "Strong";
    if (strength >= 70) return "Moderate";
    return "Emerging";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Collaboration Networks
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore research collaborations and institutional partnerships
          </p>
        </div>

        {/* Institution Selection */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Institution Analysis
            </CardTitle>
            <CardDescription>
              Select an institution to analyze its collaboration network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 px-8 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
                <Network className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Network Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-chart-blue/10 to-chart-blue/5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-blue mb-2">{networkMetrics.totalPartners}</div>
              <div className="text-sm text-muted-foreground">Partner Institutions</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-purple/10 to-chart-purple/5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-purple mb-2">
                {networkMetrics.totalPublications.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Joint Publications</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-teal/10 to-chart-teal/5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-teal mb-2">{networkMetrics.averageStrength}</div>
              <div className="text-sm text-muted-foreground">Avg. Collaboration Score</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-chart-orange/10 to-chart-orange/5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-chart-orange mb-2">{networkMetrics.topCollaborations}</div>
              <div className="text-sm text-muted-foreground">Strong Partnerships</div>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Details */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Collaborations for {selectedInstitution}
            </CardTitle>
            <CardDescription>
              Strongest research partnerships and joint projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {collaborations.map((collab, index) => (
                <div 
                  key={collab.partner}
                  className="flex items-start justify-between p-6 rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold">{collab.partner}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge 
                        variant="outline" 
                        className={`${getStrengthColor(collab.strength)} border-current`}
                      >
                        {getStrengthBadge(collab.strength)}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Research Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {collab.keyAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="bg-primary/10 text-primary">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Recent Projects</h4>
                        <ul className="text-sm space-y-1">
                          {collab.recentProjects.map((project) => (
                            <li key={project} className="text-muted-foreground">• {project}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-primary">{collab.publications}</div>
                      <div className="text-sm text-muted-foreground">Publications</div>
                    </div>
                    <div>
                      <div className={`text-lg font-semibold ${getStrengthColor(collab.strength)}`}>
                        {collab.strength}%
                      </div>
                      <div className="text-sm text-muted-foreground">Strength</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Visualization Placeholder */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: '1.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Collaboration Network Visualization
            </CardTitle>
            <CardDescription>
              Interactive network graph showing institutional connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Network className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Interactive network visualization would be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect your backend to enable real-time network graphs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Collaboration;