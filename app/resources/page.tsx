import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

// Define prop interfaces
interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
}

interface ResourceLinkProps {
  title: string;
  description: string;
  link: string;
}

export default function ResourcesPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="container py-6 md:py-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Resource Library / Tools
            </h1>
            <p className="text-muted-foreground">
              Access curated templates, toolkits, educational content, and
              official Indian government portals for startup founders.
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto mb-6">
            <Input
              type="search"
              placeholder="Search resources..."
              className="w-full"
            />
          </div>

          <Tabs defaultValue="templates" className="space-y-4">
            <TabsList className="mx-auto flex justify-center flex-wrap h-auto">
              <TabsTrigger value="templates">
                Templates & Frameworks
              </TabsTrigger>
              <TabsTrigger value="toolkits">Toolkits & Builders</TabsTrigger>
              <TabsTrigger value="education">Educational Content</TabsTrigger>
              <TabsTrigger value="government">
                Government Portals & Schemes
              </TabsTrigger>
              <TabsTrigger value="programs">Startup Programs</TabsTrigger>
            </TabsList>

            {/* Templates & Frameworks Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ResourceCard
                  title="Pitch Deck Templates"
                  description="Sequoia Capital Pitch Deck Template"
                  link="https://www.sequoiacap.com/article/writing-a-business-plan/"
                />
                <ResourceCard
                  title="Term Sheet Templates"
                  description="Y Combinator Series A Term Sheet"
                  link="https://www.ycombinator.com/series_a_term_sheet"
                />
                <ResourceCard
                  title="Business Model Canvas"
                  description="Strategyzer Business Model Canvas"
                  link="https://www.strategyzer.com/canvas/business-model-canvas"
                />
                <ResourceCard
                  title="Lean Canvas"
                  description="Leanstack Lean Canvas"
                  link="https://leanstack.com/leancanvas"
                />
              </div>
            </TabsContent>

            {/* Toolkits & Builders Tab */}
            <TabsContent value="toolkits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>MVP Builders</CardTitle>
                  <CardDescription>
                    Tools to create your Minimum Viable Product without
                    extensive coding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResourceLink
                    title="Bubble"
                    description="Visual programming platform for web apps"
                    link="https://bubble.io/"
                  />
                  <ResourceLink
                    title="Adalo"
                    description="Build native mobile apps without code"
                    link="https://www.adalo.com/"
                  />
                  <ResourceLink
                    title="Glide"
                    description="Build apps from Google Sheets"
                    link="https://www.glideapps.com/"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Idea Validators</CardTitle>
                  <CardDescription>
                    Tools to validate your startup idea with real users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResourceLink
                    title="Validately"
                    description="User testing and feedback platform"
                    link="https://validately.com/"
                  />
                  <ResourceLink
                    title="SurveyMonkey"
                    description="Survey and feedback collection tool"
                    link="https://www.surveymonkey.com/"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Launch Guides</CardTitle>
                  <CardDescription>
                    Resources for successfully launching your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResourceLink
                    title="First Round Review: Launching Startups"
                    description="Advice from top entrepreneurs"
                    link="https://review.firstround.com/"
                  />
                  <ResourceLink
                    title="Product Hunt Launch Guide"
                    description="How to successfully launch on Product Hunt"
                    link="https://blog.producthunt.com/how-to-launch-on-product-hunt/"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Educational Content Tab */}
            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top YouTube Channels for Entrepreneurs</CardTitle>
                  <CardDescription>
                    Learn from top entrepreneurs and startup experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResourceLink
                    title="Y Combinator"
                    description="Startup advice from the world's leading accelerator"
                    link="https://www.youtube.com/user/ycombinator"
                  />
                  <ResourceLink
                    title="Slidebean"
                    description="Startup stories and business advice"
                    link="https://www.youtube.com/c/Slidebean"
                  />
                  <ResourceLink
                    title="GaryVee"
                    description="Marketing and entrepreneurship insights"
                    link="https://www.youtube.com/user/GaryVaynerchuk"
                  />
                  <ResourceLink
                    title="Neil Patel"
                    description="Digital marketing strategies"
                    link="https://www.youtube.com/user/neilvkpatel"
                  />
                  <ResourceLink
                    title="TED Talks"
                    description="Inspiring talks on innovation and business"
                    link="https://www.youtube.com/user/TEDtalksDirector"
                  />
                  <ResourceLink
                    title="Startup Grind"
                    description="Interviews with successful founders"
                    link="https://www.youtube.com/user/StartupGrind"
                  />
                  <ResourceLink
                    title="Indie Hackers"
                    description="Building profitable online businesses"
                    link="https://www.youtube.com/c/IndieHackers"
                  />
                  <ResourceLink
                    title="Technology Brothers (TBPN)"
                    description="Technology and startup insights"
                    link="https://www.youtube.com/@TechnologyBrothers"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Courses</CardTitle>
                  <CardDescription>
                    Structured learning resources for entrepreneurs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ResourceLink
                    title="Startup School by Y Combinator"
                    description="Free online program for founders"
                    link="https://www.startupschool.org/"
                  />
                  <ResourceLink
                    title="Coursera: Entrepreneurship Specialization"
                    description="Wharton's comprehensive entrepreneurship course"
                    link="https://www.coursera.org/specializations/wharton-entrepreneurship"
                  />
                  <ResourceLink
                    title="edX: How to Build a Startup"
                    description="Learn the Lean Launchpad methodology"
                    link="https://www.edx.org/course/how-to-build-a-startup"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Government Portals Tab */}
            <TabsContent value="government" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Government Portals & Schemes (India)</CardTitle>
                  <CardDescription>
                    Official resources and support schemes for Indian startups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 border-b pb-4">
                    <h3 className="font-medium flex items-center">
                      <Link
                        href="https://www.startupindia.gov.in/content/sih/en/home-page.html"
                        target="_blank"
                        className="hover:underline flex items-center"
                      >
                        Startup India
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Badge className="ml-2" variant="outline">
                        Official
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Central hub for startup resources, including funding,
                      mentorship, and policies.
                    </p>
                  </div>

                  <div className="space-y-2 border-b pb-4">
                    <h3 className="font-medium flex items-center">
                      <Link
                        href="https://maarg.startupindia.gov.in/"
                        target="_blank"
                        className="hover:underline flex items-center"
                      >
                        MAARG Portal
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Badge className="ml-2" variant="outline">
                        Official
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mentorship platform connecting startups with industry
                      experts.
                    </p>
                  </div>

                  <div className="space-y-2 border-b pb-4">
                    <h3 className="font-medium flex items-center">
                      <Link
                        href="https://msh.meity.gov.in/"
                        target="_blank"
                        className="hover:underline flex items-center"
                      >
                        MeitY Startup Hub
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Badge className="ml-2" variant="outline">
                        Official
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Government initiative supporting tech startups with
                      funding and resources.
                    </p>
                  </div>

                  <div className="space-y-2 border-b pb-4">
                    <h3 className="font-medium flex items-center">
                      <Link
                        href="https://indiaai.gov.in/startup"
                        target="_blank"
                        className="hover:underline flex items-center"
                      >
                        IndiaAI
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Badge className="ml-2" variant="outline">
                        Official
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Portal for AI startups, offering news, case studies, and
                      research reports.
                    </p>
                  </div>

                  <div className="space-y-2 border-b pb-4">
                    <h3 className="font-medium flex items-center">
                      <Link
                        href="https://www.indiascienceandtechnology.gov.in/"
                        target="_blank"
                        className="hover:underline flex items-center"
                      >
                        India Science, Technology & Innovation Portal
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                      <Badge className="ml-2" variant="outline">
                        Official
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Repository of science and technology resources, including
                      funding opportunities.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold pt-4">
                    Financial Support Schemes
                  </h3>
                  <ResourceLink
                    title="Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)"
                    description="Collateral-free loans up to ₹200 lakhs for micro and small enterprises. Managed by SIDBI and Ministry of MSME."
                    link="https://www.cgtmse.in/"
                  />
                  <ResourceLink
                    title="Startup India Seed Fund Scheme"
                    description="Financial assistance for proof of concept, prototype development, product trials, market entry, and commercialization."
                    link="https://seedfund.startupindia.gov.in/"
                  />
                  <ResourceLink
                    title="State-Level Startup Initiatives"
                    description="Many states offer funding and incubation support (e.g., Bihar Startup Policy)."
                    link="https://www.startupindia.gov.in/content/sih/en/state-startup-policies.html"
                  />

                  <h3 className="text-lg font-semibold pt-4">
                    Incubation and Acceleration Programs
                  </h3>
                  <ResourceLink
                    title="Atal Incubation Centers (AICs)"
                    description="Under Atal Innovation Mission, providing infrastructure, mentorship, and funding."
                    link="https://aim.gov.in/"
                  />
                  <ResourceLink
                    title="Technology Business Incubators (TBIs)"
                    description="Supported by DST, focusing on tech startups with lab facilities, mentorship, and IP guidance."
                    link="https://dst.gov.in/innovation-and-technology-development-programmes"
                  />

                  <h3 className="text-lg font-semibold pt-4">
                    Competitions and Pitch Events
                  </h3>
                  <ResourceLink
                    title="Startup India Grand Challenges"
                    description="Sector-specific challenges with grants and implementation opportunities."
                    link="https://www.startupindia.gov.in/"
                  />
                  <ResourceLink
                    title="Entrepreneurship Summits (e.g., IIMs)"
                    description="Platforms like Uttishtha Summit (IIM Kashipur) or Entrepreneur 2025 to pitch ideas."
                    link="https://www.entrepreneurindia.com/"
                  />

                  <h3 className="text-lg font-semibold pt-4">
                    Sector-Specific Support & Grants
                  </h3>
                  <ResourceLink
                    title="Startup India Grants Database"
                    description="Search for grants relevant to specific sectors (agriculture, mining, defense, etc.) via government portals."
                    link="https://www.startupindia.gov.in/"
                  />

                  <h3 className="text-lg font-semibold pt-4">
                    Networking and Mentorship
                  </h3>
                  <ResourceLink
                    title="Community Organizations (TiE, Headstart, echai)"
                    description="Networks offering meetups and demo days for investor connections."
                    link="https://tie.org/"
                  />
                  <ResourceLink
                    title="Incubation Centers (DBT-BioNest, etc.)"
                    description="Government-supported centers hosting events and connecting entrepreneurs."
                    link="https://seedfund.startupindia.gov.in/portfolio"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Startup Programs Tab (New) */}
            <TabsContent value="programs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Big Tech Startup Programs</CardTitle>
                  <CardDescription>
                    Cloud credits, technical support, and resources from major
                    tech companies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResourceLink
                    title="Microsoft for Startups"
                    description="Up to $150k Azure credits, OpenAI credits, Office 365 benefits. Requires LinkedIn profile and business plan."
                    link="https://www.microsoft.com/en-us/startups?wt.mc_id=studentamb_359044"
                  />
                  <ResourceLink
                    title="Google for Startups Cloud Program"
                    description="Up to $200k Cloud credits ($350k for AI startups) over two years, technical support, networking."
                    link="https://cloud.google.com/programs/startup"
                  />
                  <ResourceLink
                    title="Amazon Web Services (AWS) Activate Program"
                    description="Up to $100k AWS credits, infrastructure support, AI tools. For startups < 10 years old, < $100M revenue."
                    link="https://aws.amazon.com/activate/"
                  />
                  <ResourceLink
                    title="LinkedIn (Networking)"
                    description="Valuable platform for networking, finding resources, and connecting via startup-focused groups."
                    link="https://www.linkedin.com/"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accelerator Programs</CardTitle>
                  <CardDescription>
                    Structured programs offering funding, mentorship, and
                    networking.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResourceLink
                    title="Y Combinator"
                    description="Invests $500k for 7% equity. Includes mentorship, funding, and networking."
                    link="https://www.ycombinator.com/"
                  />
                  <ResourceLink
                    title="Techstars"
                    description="Industry-focused accelerators. Funding ($120k) and networking for 6–10% equity."
                    link="https://www.techstars.com/"
                  />
                  <ResourceLink
                    title="500 Startups"
                    description="16-week accelerator program with up to $150k funding for early-stage tech companies."
                    link="https://500.co/"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Helper component for resource cards
function ResourceCard({ title, description, link }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Link
          href={link}
          target="_blank"
          className="text-blue-600 hover:underline flex items-center"
        >
          {description}
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

// Helper component for resource links
function ResourceLink({ title, description, link }: ResourceLinkProps) {
  return (
    <div className="pb-2">
      <Link
        href={link}
        target="_blank"
        className="font-medium hover:underline flex items-center text-blue-600"
      >
        {title}
        <ExternalLink className="h-3 w-3 ml-1" />
      </Link>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
