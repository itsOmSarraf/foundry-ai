// CompanyResearchHome.tsx

"use client";
import { useState, FormEvent } from "react";
import LinkedInDisplay from "./linkedin/LinkedinDisplay";
import CompetitorsDisplay from "./competitors/CompetitorsDisplay";
import NewsDisplay from "./news/NewsDisplay";
import CompanySummary from "./companycontent/CompanySummar";
import FundingDisplay from "./companycontent/FundingDisplay";
import ProfileDisplay from "./twitter/TwitterProfileDisplay";
import RecentTweetsDisplay from "./twitter/RecentTweetsDisplay";
import YoutubeVideosDisplay from "./youtube/YoutubeVideosDisplay";
import RedditDisplay from "./reddit/RedditDisplay";
import GitHubDisplay from "./github/GitHubDisplay";
import FinancialReportDisplay from './financial/FinancialReportDisplay';
import TikTokDisplay from './tiktok/TikTokDisplay';
import WikipediaDisplay from './wikipedia/WikipediaDisplay';
import CrunchbaseDisplay from './crunchbase/CrunchbaseDisplay';
import PitchBookDisplay from './pitchbook/PitchBookDisplay';
import TracxnDisplay from "./tracxn/TracxnDisplay";
import FoundersDisplay from "./founders/FoundersDisplay";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LinkedInSkeleton,
  YouTubeSkeleton,
  TikTokSkeleton,
  GitHubSkeleton,
  RedditSkeleton,
  TwitterSkeleton,
  CompetitorsSkeleton,
  NewsSkeleton,
  FoundersSkeleton,
  WikipediaSkeleton,
  FinancialSkeleton,
  FundingSkeleton,
  CompanySummarySkeleton,
} from "./skeletons/ResearchSkeletons";
import CompanyMindMap from './mindmap/CompanyMindMap';

interface LinkedInData {
  text: string;
  url: string;
  image: string;
  title: string;
  [key: string]: any;
}

interface Video {
  id: string;
  url: string;
  title: string;
  author: string;
  [key: string]: any;
}

interface RedditPost {
  url: string;
  title: string;
  [key: string]: any;
}

interface Tweet {
  id: string;
  url: string;
  title: string;
  author: string;
  [key: string]: any;
}

interface Competitor {
  title: string;
  url: string;
  summary: string;
  [key: string]: any;
}

interface NewsItem {
  url: string;
  title: string;
  image: string;
  [key: string]: any;
}

interface Founder {
  url: string;
  title: string;
  [key: string]: any;
}

// Add new interface for company map data
interface CompanyMapData {
  companyName: string;
  rootNode: {
    title: string;
    children: Array<{
      title: string;
      description: string;
      children: Array<{
        title: string;
        description: string;
      }>;
    }>;
  };
}

export default function CompanyResearcher() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [companyUrl, setCompanyUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [twitterProfileText, setTwitterProfileText] = useState<any>(null);
  const [recentTweets, setRecentTweets] = useState<Tweet[] | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<Video[] | null>(null);
  const [redditPosts, setRedditPosts] = useState<RedditPost[] | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [fundingData, setFundingData] = useState<any>(null);
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [tiktokData, setTiktokData] = useState<any>(null);
  const [wikipediaData, setWikipediaData] = useState<any>(null);
  const [crunchbaseData, setCrunchbaseData] = useState<any>(null);
  const [pitchbookData, setPitchbookData] = useState<any>(null);
  const [tracxnData, setTracxnData] = useState<any>(null);
  const [founders, setFounders] = useState<Founder[] | null>(null);
  const [companyMap, setCompanyMap] = useState<CompanyMapData | null>(null);

  // Function to check if a string is a valid URL
  const isValidUrl = (url: string): boolean => {
    try {
      // Remove any whitespace
      url = url.trim();

      // Check if it's just a single word without dots
      if (!url.includes('.')) {
        return false;
      }

      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      // Check if hostname has at least one dot and no spaces
      return urlObj.hostname.includes('.') && !urlObj.hostname.includes(' ');
    } catch {
      return false;
    }
  };

  // Function to validate and extract domain name from URL
  const extractDomain = (url: string): string | null => {
    try {
      if (!isValidUrl(url)) {
        return null;
      }

      let cleanUrl = url.trim().toLowerCase();

      // Add protocol if missing
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // Parse URL
      const parsedUrl = new URL(cleanUrl);

      // Get domain without www.
      const domain = parsedUrl.hostname.replace(/^www\./, '');

      // Additional validation: domain should have at least one dot and no spaces
      if (!domain.includes('.') || domain.includes(' ')) {
        return null;
      }

      return domain;
    } catch (error) {
      return null;
    }
  };

  // LinkedIn API fetch function
  const fetchLinkedInData = async (url: string) => {
    try {
      const response = await fetch('/api/scrapelinkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('LinkedIn research failed');
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      throw error;
    }
  };

  // Function to scrape main page
  const scrapeMainPage = async (url: string) => {
    try {
      const response = await fetch('/api/scrapewebsiteurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch main website data');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error scraping main page:', error);
      throw error;
    }
  };

  // Function to fetch company details (summary and map)
  const fetchCompanyDetails = async (mainPageData: any, url: string) => {
    try {
      // First fetch subpages
      const subpagesResponse = await fetch('/api/scrapewebsitesubpages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!subpagesResponse.ok) {
        throw new Error('Failed to fetch subpages data');
      }

      const subpagesData = await subpagesResponse.json();

      // Then use both main page and subpages data
      await Promise.all([
        fetchCompanySummary(subpagesData.results, mainPageData, url),
        fetchCompanyMap(mainPageData, url)
      ]);
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  // Update fetchCompetitors to only use main page data
  const fetchCompetitors = async (summary: string, url: string) => {
    try {
      const response = await fetch('/api/findcompetitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteurl: url,
          summaryText: summary
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch competitors');
      }

      const data = await response.json();
      return data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        summary: result.summary,
      }));
    } catch (error) {
      console.error('Error fetching competitors:', error);
      throw error;
    }
  };

  // New function to fetch news
  const fetchNews = async (url: string) => {
    try {
      const response = await fetch('/api/findnews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('News research failed');
      }

      const data = await response.json();
      return data.results.filter((item: any) => item.title).slice(0, 6);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  // Separate function for fetching company summary
  const fetchCompanySummary = async (subpages: any, mainpage: any, websiteurl: string) => {
    try {
      const response = await fetch('/api/companysummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subpages,
          mainpage,
          websiteurl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company summary');
      }

      const data = await response.json();
      setCompanySummary(data.result);
    } catch (error) {
      console.error('Error fetching company summary:', error);
      setErrors(prev => ({ ...prev, summary: error instanceof Error ? error.message : 'An error occurred with company summary' }));
    }
  };

  // New function for fetching company map
  const fetchCompanyMap = async (mainpage: any, websiteurl: string) => {
    try {
      const response = await fetch('/api/companymap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainpage,
          websiteurl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company map');
      }

      const data = await response.json();
      setCompanyMap(data.result);
    } catch (error) {
      console.error('Error fetching company map:', error);
      setErrors(prev => ({ ...prev, map: error instanceof Error ? error.message : 'An error occurred with company map' }));
    }
  };

  // Recent tweets fetch function
  const fetchRecentTweets = async (username: string) => {
    try {
      const response = await fetch('/api/scraperecenttweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent tweets');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching recent tweets:', error);
      throw error;
    }
  };

  // Twitter profile fetch function
  const fetchTwitterProfile = async (url: string) => {
    try {
      const response = await fetch('/api/scrapetwitterprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Twitter profile');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        // Fetch tweets separately without waiting
        if (result.author) {
          fetchRecentTweets(result.author)
            .then(tweets => setRecentTweets(tweets))
            .catch(error => console.error('Error fetching recent tweets:', error));
        }
        return {
          text: result.text,
          username: result.author
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Twitter profile:', error);
      throw error;
    }
  };
  // Youtube videos fetch function
  const fetchYoutubeVideos = async (url: string) => {
    try {
      const response = await fetch('/api/fetchyoutubevideos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch YouTube videos');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw error;
    }
  };

  // Reddit posts fetch function
  const fetchRedditPosts = async (url: string) => {
    try {
      const response = await fetch('/api/scrapereddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Reddit posts');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
      throw error;
    }
  };

  // GitHub URL fetch function
  const fetchGitHubUrl = async (url: string) => {
    try {
      const response = await fetch('/api/fetchgithuburl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub URL');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].url;
      }
      return null;
    } catch (error) {
      console.error('Error fetching GitHub URL:', error);
      throw error;
    }
  };

  // Funding API fetch function
  const fetchFunding = async (url: string) => {
    try {
      const response = await fetch('/api/fetchfunding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch funding data');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching funding data:', error);
      throw error;
    }
  };

  // Financial report fetch function
  const fetchFinancialReport = async (url: string) => {
    try {
      const response = await fetch('/api/fetchfinancialreport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch financial report');
      }

      const data = await response.json();
      return data.results || null;
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  };

  // TikTok fetch function
  const fetchTikTokProfile = async (url: string) => {
    try {
      const response = await fetch('/api/fetchtiktok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TikTok profile');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching TikTok profile:', error);
      throw error;
    }
  };

  // Wikipedia fetch function
  const fetchWikipedia = async (url: string) => {
    try {
      const response = await fetch('/api/fetchwikipedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Wikipedia data');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          text: data.results[0].text,
          url: data.results[0].url
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      throw error;
    }
  };

  // Crunchbase fetch function
  const fetchCrunchbase = async (url: string) => {
    try {
      const response = await fetch('/api/fetchcrunchbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Crunchbase data');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching Crunchbase data:', error);
      throw error;
    }
  };

  // PitchBook fetch function
  const fetchPitchbook = async (url: string) => {
    try {
      const response = await fetch('/api/fetchpitchbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PitchBook data');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching PitchBook data:', error);
      throw error;
    }
  };

  // Tracxn fetch function
  const fetchTracxn = async (url: string) => {
    try {
      const response = await fetch('/api/fetchtracxn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Tracxn data');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching Tracxn data:', error);
      throw error;
    }
  };

  // Founders fetch function
  const fetchFounders = async (url: string) => {
    try {
      const response = await fetch('/api/fetchfounders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteurl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch founders');
      }

      const data = await response.json();
      // Filter out company and post URLs, only keep individual profiles
      return data.results.filter((result: any) =>
        !result.url.includes('/company/') &&
        !result.url.includes('/post/') &&
        result.url.includes('/in/')
      );
    } catch (error) {
      console.error('Error fetching founders:', error);
      throw error;
    }
  };

  // Add helper function to process LinkedIn text
  const processLinkedInText = (data: LinkedInData) => {
    const extract = (marker: string): string => {
      const index = data.text.indexOf(marker);
      if (index === -1) return '';

      const start = index + marker.length;
      const possibleEndMarkers = ['Industry', 'Company size', 'Headquarters', '\n\n'];
      let end = data.text.length;

      for (const endMarker of possibleEndMarkers) {
        const nextIndex = data.text.indexOf(endMarker, start);
        if (nextIndex !== -1 && nextIndex < end && nextIndex > start) {
          end = nextIndex;
        }
      }

      return data.text.substring(start, end).trim();
    };

    return {
      companySize: extract('Company size')
    };
  };

  // Add helper function to parse company size
  const parseCompanySize = (size: string): number => {
    if (!size) return 0;
    // Extract first number from string (e.g. "1,001-5,000" -> 1001)
    const match = size.match(/(\d+(?:,\d+)*)/);
    if (!match) return 0;
    return parseInt(match[1].replace(/,/g, ''));
  };

  // Main Research Function
  const handleResearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!companyUrl) {
      setErrors({ form: "Please enter a company URL" });
      return;
    }

    const domainName = extractDomain(companyUrl);

    if (!domainName) {
      setErrors({ form: "Please enter a valid company URL ('example.com')" });
      return;
    }

    setIsGenerating(true);
    setErrors({});

    // Reset all states to null
    setLinkedinData(null);
    setCompetitors(null);
    setNews(null);
    setCompanySummary(null);
    setTwitterProfileText(null);
    setRecentTweets(null);
    setYoutubeVideos(null);
    setRedditPosts(null);
    setGithubUrl(null);
    setFundingData(null);
    setFinancialReport(null);
    setTiktokData(null);
    setWikipediaData(null);
    setCrunchbaseData(null);
    setPitchbookData(null);
    setTracxnData(null);
    setFounders(null);
    setCompanyMap(null);

    try {
      // Run all API calls in parallel
      const promises = [
        // Main page scraping and dependent calls
        (async () => {
          const mainPageData = await scrapeMainPage(domainName);
          if (mainPageData && mainPageData[0]?.summary) {
            await Promise.all([
              fetchCompanyDetails(mainPageData, domainName)
                .catch((error) => setErrors(prev => ({ ...prev, companyDetails: error instanceof Error ? error.message : 'An error occurred with company details' }))),
              fetchCompetitors(mainPageData[0].summary, domainName)
                .then((data) => setCompetitors(data))
                .catch((error) => setErrors(prev => ({ ...prev, competitors: error instanceof Error ? error.message : 'An error occurred with competitors' })))
            ]);
          }
        })().catch((error) => setErrors(prev => ({ ...prev, websiteData: error instanceof Error ? error.message : 'An error occurred with website data' }))),

        // Independent API calls that don't need main page data
        fetchLinkedInData(domainName)
          .then((data) => setLinkedinData(data))
          .catch((error) => setErrors(prev => ({ ...prev, linkedin: error instanceof Error ? error.message : 'An error occurred with LinkedIn' }))),

        fetchNews(domainName)
          .then((data) => setNews(data))
          .catch((error) => setErrors(prev => ({ ...prev, news: error instanceof Error ? error.message : 'An error occurred with news' }))),

        fetchTwitterProfile(domainName)
          .then((data) => setTwitterProfileText(data))
          .catch((error) => setErrors(prev => ({ ...prev, twitter: error instanceof Error ? error.message : 'An error occurred with Twitter profile' }))),

        fetchYoutubeVideos(domainName)
          .then((data) => setYoutubeVideos(data))
          .catch((error) => setErrors(prev => ({ ...prev, youtube: error instanceof Error ? error.message : 'An error occurred with YouTube videos' }))),

        fetchRedditPosts(domainName)
          .then((data) => setRedditPosts(data))
          .catch((error) => setErrors(prev => ({ ...prev, reddit: error instanceof Error ? error.message : 'An error occurred with Reddit posts' }))),

        fetchGitHubUrl(domainName)
          .then((url) => setGithubUrl(url))
          .catch((error) => setErrors(prev => ({ ...prev, github: error instanceof Error ? error.message : 'An error occurred with GitHub' }))),

        fetchFunding(domainName)
          .then((data) => setFundingData(data))
          .catch((error) => setErrors(prev => ({ ...prev, funding: error instanceof Error ? error.message : 'An error occurred with funding data' }))),

        fetchFinancialReport(domainName)
          .then((data) => setFinancialReport(data))
          .catch((error) => setErrors(prev => ({ ...prev, financial: error instanceof Error ? error.message : 'An error occurred with financial report' }))),

        fetchTikTokProfile(domainName)
          .then((data) => setTiktokData(data))
          .catch((error) => setErrors(prev => ({ ...prev, tiktok: error instanceof Error ? error.message : 'An error occurred with TikTok profile' }))),

        fetchWikipedia(domainName)
          .then((data) => setWikipediaData(data))
          .catch((error) => setErrors(prev => ({ ...prev, wikipedia: error instanceof Error ? error.message : 'An error occurred with Wikipedia data' }))),

        fetchCrunchbase(domainName)
          .then((data) => setCrunchbaseData(data))
          .catch((error) => setErrors(prev => ({ ...prev, crunchbase: error instanceof Error ? error.message : 'An error occurred with Crunchbase data' }))),

        fetchPitchbook(domainName)
          .then((data) => setPitchbookData(data))
          .catch((error) => setErrors(prev => ({ ...prev, pitchbook: error instanceof Error ? error.message : 'An error occurred with PitchBook data' }))),

        fetchTracxn(domainName)
          .then((data) => setTracxnData(data))
          .catch((error) => setErrors(prev => ({ ...prev, tracxn: error instanceof Error ? error.message : 'An error occurred with Tracxn data' }))),

        fetchFounders(domainName)
          .then((data) => setFounders(data))
          .catch((error) => setErrors(prev => ({ ...prev, founders: error instanceof Error ? error.message : 'An error occurred with founders' })))
      ];

      await Promise.allSettled(promises);
    } finally {
      setIsGenerating(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl p-6 z-10 mb-20 mt-6">
      <motion.h1 
        className="md:text-6xl text-4xl pb-5 font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Company Researcher
      </motion.h1>

      <motion.p 
        className="text-xl text-muted-foreground mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Enter a company URL for detailed research info. Instantly know any company inside out.
      </motion.p>

      <motion.form 
        onSubmit={handleResearch} 
        className="space-y-6 mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <input
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
          placeholder="Enter Company URL (e.g., example.com)"
          className="w-full bg-card p-3 border border-border box-border outline-none rounded-md resize-none ring-2 ring-primary/20 focus:ring-primary/50 transition-all"
        />
        <button
          type="submit"
          className={`w-full text-white font-semibold px-2 py-3 rounded-md transition-all min-h-[50px] ${isGenerating ? 'bg-muted' : 'bg-primary hover:bg-primary/90'}`}
          disabled={isGenerating}
        >
          {isGenerating ? 'Researching...' : 'Research Now'}
        </button>

        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4">
          <span className="text-muted-foreground">Powered by</span>
          <a
            href="https://exa.ai"
            target="_blank"
            rel="origin"
            className="hover:opacity-80 transition-opacity"
          >
            <img src="/exa_logo.png" alt="Exa Logo" className="h-6 sm:h-7 object-contain" />
          </a>
        </div>
      </motion.form>

      {Object.entries(errors).map(([key, message]) => (
        <motion.div 
          key={key} 
          className="mt-4 mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      ))}

      <div className="space-y-12">
        {/* Company Overview Section */}

        {(linkedinData || companySummary || founders || financialReport ||
          fundingData || crunchbaseData || pitchbookData || tracxnData ||
          wikipediaData) && (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Company Overview</h2>
            </motion.div>
          )}

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {isGenerating && founders === null ? (
            <FoundersSkeleton />
          ) : founders && founders.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <FoundersDisplay founders={founders} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {linkedinData && parseCompanySize(processLinkedInText(linkedinData).companySize) >= 1000 && (
            isGenerating && financialReport === null ? (
              <FinancialSkeleton />
            ) : financialReport && (
              <motion.div variants={staggerItem}>
                <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle>Financial Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FinancialReportDisplay report={financialReport} />
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}

          {isGenerating && fundingData === null ? (
            <FundingSkeleton />
          ) : fundingData && (
            <motion.div variants={staggerItem}>
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Funding</CardTitle>
                </CardHeader>
                <CardContent>
                  <FundingDisplay fundingData={fundingData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && crunchbaseData === null ? (
            <FundingSkeleton />
          ) : crunchbaseData && (
            <motion.div variants={staggerItem}>
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Crunchbase</CardTitle>
                </CardHeader>
                <CardContent>
                  <CrunchbaseDisplay data={crunchbaseData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && pitchbookData === null ? (
            <FundingSkeleton />
          ) : pitchbookData && (
            <motion.div variants={staggerItem}>
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>PitchBook</CardTitle>
                </CardHeader>
                <CardContent>
                  <PitchBookDisplay data={pitchbookData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && tracxnData === null ? (
            <FundingSkeleton />
          ) : tracxnData && (
            <motion.div variants={staggerItem}>
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Tracxn</CardTitle>
                </CardHeader>
                <CardContent>
                  <TracxnDisplay data={tracxnData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && wikipediaData === null ? (
            <WikipediaSkeleton />
          ) : wikipediaData && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Wikipedia</CardTitle>
                </CardHeader>
                <CardContent>
                  <WikipediaDisplay data={wikipediaData} websiteUrl={companyUrl} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && competitors === null ? (
            <CompetitorsSkeleton />
          ) : competitors && competitors.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompetitorsDisplay competitors={competitors} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && news === null ? (
            <NewsSkeleton />
          ) : news && news.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Latest News</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsDisplay news={news} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>


        {/* Company Socials Section */}
        {(twitterProfileText || youtubeVideos || tiktokData ||
          redditPosts || githubUrl) && (
            <motion.div 
              className="flex items-center pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Company Socials</h2>
            </motion.div>
          )}

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {isGenerating && twitterProfileText === null ? (
            <TwitterSkeleton />
          ) : twitterProfileText && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Twitter Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileDisplay rawText={twitterProfileText.text} username={twitterProfileText.username} />
                  {recentTweets && <RecentTweetsDisplay tweets={recentTweets} />}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && youtubeVideos === null ? (
            <YouTubeSkeleton />
          ) : youtubeVideos && youtubeVideos.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>YouTube Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <YoutubeVideosDisplay videos={youtubeVideos} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && redditPosts === null ? (
            <RedditSkeleton />
          ) : redditPosts && redditPosts.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Reddit Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <RedditDisplay posts={redditPosts} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && tiktokData === null ? (
            <TikTokSkeleton />
          ) : tiktokData && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>TikTok Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <TikTokDisplay data={tiktokData} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isGenerating && githubUrl === null ? (
            <GitHubSkeleton />
          ) : githubUrl && (
            <motion.div variants={staggerItem} className="col-span-1 md:col-span-2">
              <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                  <GitHubDisplay githubUrl={githubUrl} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>


        {/* Summary and Mind Map Section */}
        {(isGenerating || companySummary) && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div className="flex items-center">
              <h2 className="text-3xl font-medium mt-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Summary and Mind Map</h2>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-1 gap-6"
            >
              {isGenerating && companySummary === null ? (
                <CompanySummarySkeleton />
              ) : companySummary && (
                <motion.div variants={staggerItem}>
                  <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle>Company Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CompanySummary summary={companySummary} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isGenerating && companyMap === null ? (
                <div className="hidden sm:block animate-pulse">
                  <Card className="border border-border shadow-md">
                    <CardContent className="p-6">
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-md">Loading...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : companyMap && (
                <motion.div variants={staggerItem} className="hidden sm:block">
                  <Card className="border border-border shadow-md hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle>Mind Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CompanyMindMap data={companyMap} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}