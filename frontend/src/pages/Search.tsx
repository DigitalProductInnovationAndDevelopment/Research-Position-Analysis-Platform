import { useState } from "react";
import { Search as SearchIcon, Filter, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [institution, setInstitution] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [funding, setFunding] = useState("");
  const [openAccess, setOpenAccess] = useState(false);
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [publicationYear, setPublicationYear] = useState<Date | undefined>(undefined);
  const [yearRange, setYearRange] = useState<{ from: string; to: string }>({ from: "2000", to: "2010" });
  const [searchQueryWarn, setSearchQueryWarn] = useState("");
  const [authorWarn, setAuthorWarn] = useState("");
  const [institutionWarn, setInstitutionWarn] = useState("");
  const [fundingWarn, setFundingWarn] = useState("");
  const [topicWarn, setTopicWarn] = useState("");
  const [typeWarn, setTypeWarn] = useState("");

  // Mock data for demonstration
  const mockResults = [
    {
      title: "Machine Learning Applications in Healthcare: A Comprehensive Review",
      authors: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emma Wilson"],
      year: 2023,
      affiliation: "Stanford University",
      citations: 45,
      abstract: "This paper presents a comprehensive review of machine learning applications in healthcare, covering recent advances in medical imaging, diagnosis, and treatment prediction.",
      tags: ["Machine Learning", "Healthcare", "Medical Imaging", "AI"]
    },
    {
      title: "Quantum Computing: Recent Developments and Future Prospects",
      authors: ["Prof. David Kumar", "Dr. Lisa Zhang"],
      year: 2023,
      affiliation: "MIT",
      citations: 67,
      abstract: "An analysis of recent developments in quantum computing technology and its potential applications in cryptography, optimization, and scientific simulation.",
      tags: ["Quantum Computing", "Cryptography", "Optimization"]
    },
    {
      title: "Sustainable Energy Systems: A Multi-Disciplinary Approach",
      authors: ["Dr. Robert Martinez", "Prof. Anna Kowalski", "Dr. James Thompson"],
      year: 2022,
      affiliation: "UC Berkeley",
      citations: 89,
      abstract: "This study examines sustainable energy systems from multiple disciplinary perspectives, including engineering, economics, and environmental science.",
      tags: ["Sustainable Energy", "Renewable Energy", "Environmental Science"]
    }
  ];

  const affiliations = ["Stanford University", "MIT", "UC Berkeley", "Harvard University", "Oxford University"];
  const years = ["2023", "2022", "2021", "2020", "2019"];

  // Helper to check for numbers
  const containsNumber = (str: string) => /\d/.test(str);

  const handleSearch = () => {
    // In a real application, you would send this data to your backend API
    console.log("Searching for:", {
      searchQuery,
      author,
      institution,
      funding,
      openAccess,
      topic,
      type,
      publicationYear,
      yearRange,
    });
    alert("Search functionality not yet implemented. Data logged to console.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Publication Search
          </h1>
          <p className="text-lg text-muted-foreground">
            Search and filter through millions of research publications
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              Search Publications
            </CardTitle>
            <CardDescription>
              Enter keywords and apply filters to find relevant research
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSearch();
              }}
              className="space-y-4"
            >
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter keywords (e.g., machine learning, quantum computing...)"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (containsNumber(val)) {
                      setSearchQueryWarn("Numbers are not allowed in keywords.");
                    } else {
                      setSearchQueryWarn("");
                    }
                    setSearchQuery(val.replace(/\d/g, ""));
                  }}
                  className="pl-10 h-12 text-lg"
                />
                {searchQueryWarn && <div className="text-red-500 text-xs mt-1">{searchQueryWarn}</div>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Author
                  </label>
                  <Input
                    placeholder="Type author name"
                    value={author}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (containsNumber(val)) {
                        setAuthorWarn("Numbers are not allowed in author name.");
                      } else {
                        setAuthorWarn("");
                      }
                      setAuthor(val.replace(/\d/g, ""));
                    }}
                  />
                  {authorWarn && <div className="text-red-500 text-xs mt-1">{authorWarn}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Institution
                  </label>
                  <Input
                    placeholder="Type institution name"
                    value={institution}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (containsNumber(val)) {
                        setInstitutionWarn("Numbers are not allowed in institution name.");
                      } else {
                        setInstitutionWarn("");
                      }
                      setInstitution(val.replace(/\d/g, ""));
                    }}
                  />
                  {institutionWarn && <div className="text-red-500 text-xs mt-1">{institutionWarn}</div>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-end gap-2 mt-4">
                <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => setShowAdvanced(true)}
                  type="button"
                >
                  Advanced Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowAdvanced(false)}
            />
            {/* Advanced Filters Drawer */}
            <div
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 animate-slide-in flex flex-col border-l border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-bold">Advanced Filters</h2>
                <Button size="sm" variant="ghost" onClick={() => setShowAdvanced(false)}>
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Funding</label>
                  <Input
                    placeholder="Enter funding source or grant..."
                    value={funding}
                    onChange={e => {
                      const val = e.target.value;
                      if (containsNumber(val)) {
                        setFundingWarn("Numbers are not allowed in funding.");
                      } else {
                        setFundingWarn("");
                      }
                      setFunding(val.replace(/\d/g, ""));
                    }}
                  />
                  {fundingWarn && <div className="text-red-500 text-xs mt-1">{fundingWarn}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Open Access</label>
                  <Switch checked={openAccess} onCheckedChange={setOpenAccess} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Topic</label>
                  <Input
                    placeholder="Enter topic..."
                    value={topic}
                    onChange={e => {
                      const val = e.target.value;
                      if (containsNumber(val)) {
                        setTopicWarn("Numbers are not allowed in topic.");
                      } else {
                        setTopicWarn("");
                      }
                      setTopic(val.replace(/\d/g, ""));
                    }}
                  />
                  {topicWarn && <div className="text-red-500 text-xs mt-1">{topicWarn}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Input
                    placeholder="Enter publication type..."
                    value={type}
                    onChange={e => {
                      const val = e.target.value;
                      if (containsNumber(val)) {
                        setTypeWarn("Numbers are not allowed in type.");
                      } else {
                        setTypeWarn("");
                      }
                      setType(val.replace(/\d/g, ""));
                    }}
                  />
                  {typeWarn && <div className="text-red-500 text-xs mt-1">{typeWarn}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Publication Year</label>
                  <Calendar
                    mode="single"
                    selected={publicationYear}
                    onSelect={setPublicationYear}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={yearRange.from}
                      onChange={e => setYearRange({ ...yearRange, from: e.target.value })}
                    />
                    <span className="self-center">-</span>
                    <Input
                      type="number"
                      placeholder="To"
                      value={yearRange.to}
                      onChange={e => setYearRange({ ...yearRange, to: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            <Badge variant="secondary" className="text-sm">
              {mockResults.length} publications found
            </Badge>
          </div>

          <div className="space-y-6">
            {mockResults.map((result, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 hover:text-primary cursor-pointer transition-colors">
                        {result.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {result.authors.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {result.affiliation}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold">Year:</span>
                          {result.year}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Citations</div>
                      <div className="text-2xl font-bold text-primary">{result.citations}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {result.abstract}
                  </p>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;