"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const MotionCard = motion(Card);

export default function HomePage() {

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Foundry.AI
          </motion.h1>
          <motion.p
            className="text-xl italic text-muted-foreground mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            for forging startups
          </motion.p>
          <motion.p
            className="text-3xl font-medium mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your AI co-pilot for startup success
          </motion.p>
          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Validate ideas, discover investors, build teams and launch your startup faster with our AI-powered platform.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, y: -30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              <Link href="/onboarding">Start Building</Link>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.svg
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="py-20 px-4" id="how-it-works"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-16" variants={fadeInUp}>
            How It Works
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "1. Quick Onboarding",
                description: "Tell us about yourself and your startup idea in a few simple steps.",
                icon: "🚀"
              },
              {
                title: "2. Chat with AI",
                description: "Have a conversation with our AI co-pilot about your startup needs and challenges.",
                icon: "💬"
              },
              {
                title: "3. Get Actionable Results",
                description: "Receive personalized insights, recommendations, and resources to move forward.",
                icon: "✅"
              }
            ].map((step, i) => (
              <MotionCard
                key={i}
                className="border-none shadow-lg bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{step.description}</p>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        className="py-20 px-4 bg-muted/50" id="use-cases"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-16" variants={fadeInUp}>
            What You Can Do
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              "Validate your startup idea",
              "Analyze competitors",
              "Discover local investors",
              "Build a business model",
              "Find co-founders",
              "Understand legal requirements",
              "Explore market fit",
              "Get government scheme suggestions",
              "Generate profit projections"
            ].map((useCase, i) => (
              <MotionCard
                key={i}
                className="border-none shadow-md h-full flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-center font-medium">{useCase}</p>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Chat-first Experience */}
      <motion.section
        className="py-20 px-4" id="chat-experience"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chat-first Experience</h2>
              <p className="text-xl mb-6">Building a startup doesn't have to be complicated. Simply chat with your AI co-pilot and get the guidance you need.</p>
              <motion.ul
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[
                  "No complex forms or spreadsheets",
                  "Natural conversation interface",
                  "Ask questions in plain language",
                  "Get personalized responses",
                  "Save and continue conversations"
                ].map((point, i) => (
                  <motion.li key={i} className="flex items-start" variants={staggerItem}>
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              className="bg-muted rounded-xl p-6 shadow-xl border border-border"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                <motion.div
                  className="bg-background p-4 rounded-lg self-start max-w-[80%]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-muted-foreground">Foundry.AI</p>
                  <p>Hi there! I'm your startup co-pilot. How can I help you today?</p>
                </motion.div>
                <motion.div
                  className="bg-primary/10 p-4 rounded-lg self-end max-w-[80%]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p>I have an idea for a food delivery app focused on healthy meals. How do I validate it?</p>
                </motion.div>
                <motion.div
                  className="bg-background p-4 rounded-lg self-start max-w-[80%]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-muted-foreground">Foundry.AI</p>
                  <p>Great idea! To validate it, I recommend these steps:</p>
                  <ol className="list-decimal ml-5 mt-2">
                    <li>Survey potential customers</li>
                    <li>Analyze existing competitors</li>
                    <li>Create a simple landing page</li>
                  </ol>
                  <p className="mt-2">Would you like me to help with any of these?</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-20 px-4 bg-muted/50" id="testimonials"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-16" variants={fadeInUp}>
            Founder Testimonials
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                quote: "Foundry.AI helped me validate my SaaS idea and find my first angel investor in just two weeks!",
                name: "Sarah Chen",
                role: "Founder, DataSync"
              },
              {
                quote: "The legal guidance saved me thousands in lawyer fees and the competitor analysis was spot on.",
                name: "Michael Rodriguez",
                role: "Co-founder, GreenDelivery"
              },
              {
                quote: "I used Foundry.AI to find my technical co-founder and build a realistic business model. Game changer!",
                name: "Aisha Johnson",
                role: "CEO, HealthTrack"
              }
            ].map((testimonial, i) => (
              <MotionCard
                key={i}
                className="border-none shadow-lg bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="text-4xl mb-4">"</div>
                    <p className="flex-grow mb-6 italic">{testimonial.quote}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Backed by Powerful Tools */}
      <motion.section
        className="py-20 px-4" id="tools"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={fadeInUp}>
            Backed by Powerful Tools
          </motion.h2>
          <motion.p className="text-xl mb-10 max-w-2xl mx-auto" variants={fadeInUp}>
            We've integrated the most advanced AI technologies to give you the best startup guidance.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { name: "Gemini", desc: "Advanced AI model" },
              { name: "Exa", desc: "Knowledge engine" },
              { name: "Next.js", desc: "Web framework" }
            ].map((tool, i) => (
              <motion.div key={i} className="flex flex-col items-center" variants={staggerItem}>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">{tool.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-20 px-4 bg-muted/50" id="faq"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-16" variants={fadeInUp}>
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                q: "Do I need a startup idea already?",
                a: "While it helps to have an idea, Foundry.AI can also help you brainstorm and refine startup concepts based on your interests and expertise."
              },
              {
                q: "Is Foundry.AI free to use?",
                a: "We offer a free tier with limited features and premium plans for founders who need more advanced guidance and support."
              },
              {
                q: "Can I get legal help for my startup?",
                a: "Yes! Foundry.AI can provide general legal guidance, document templates, and connect you with startup-friendly legal resources."
              },
              {
                q: "How accurate are the AI recommendations?",
                a: "Our AI provides guidance based on current market data and startup best practices, but we recommend using it as a starting point for your own research and decisions."
              }
            ].map((faq, i) => (
              <MotionCard
                key={i}
                className="border-none shadow-md bg-background/80 backdrop-blur-sm"
                variants={staggerItem}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{faq.a}</p>
                </CardContent>
              </MotionCard>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-24 px-4" id="cta"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={fadeInUp}>
            Ready to Build Your Startup?
          </motion.h2>
          <motion.p className="text-xl mb-10 max-w-2xl mx-auto" variants={fadeInUp}>
            No sign-up required. Start chatting with your AI co-pilot today and take your first step toward startup success.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              <Link href="/onboarding">Try the AI Co-Pilot</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Foundry.AI</h3>
              <p className="text-sm text-muted-foreground">Your AI-powered startup co-pilot</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">GitHub</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Twitter</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Foundry.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 