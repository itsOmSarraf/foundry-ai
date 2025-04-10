'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Greeting = () => {
  const [founderName, setFounderName] = useState<string>("");
  const [startupIdea, setStartupIdea] = useState<string>("");
  const [hasOnboardingData, setHasOnboardingData] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("onboardingData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setHasOnboardingData(true);
        if (data.founder_name) {
          setFounderName(data.founder_name);
        }
        if (data.idea_one_liner) {
          setStartupIdea(data.idea_one_liner);
        }
      }
    } catch (error) {
      console.error("Error loading founder data:", error);
    }
  }, []);

  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-10 px-8 size-full flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold flex items-center gap-2"
      >
        <span>👋</span> 
        <span>Hey {founderName ? founderName : "Founder"}!</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-primary mt-1"
      >
        Welcome to Foundry.AI – your AI startup co-pilot.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-muted-foreground mt-2"
      >
        You can ask me <span className="italic">anything</span> to help you go from idea → launch.
      </motion.div>

      {hasOnboardingData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-muted/50 p-4 rounded-lg border border-border"
        >
          <h3 className="font-medium flex items-center gap-2">
            <span>📝</span> Your Startup Idea:
          </h3>
          <p className="mt-2 text-muted-foreground italic">
            {startupIdea || "Not defined yet. Use the chat to describe your idea!"}
          </p>
          
          {!hasOnboardingData && (
            <div className="mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-primary/10 p-2 rounded-lg"
              >
                <a href="/onboarding" className="text-sm text-primary font-medium flex items-center justify-center">
                  Complete your profile to get personalized advice →
                </a>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
      
      {!hasOnboardingData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-4 bg-primary/10 rounded-lg border border-primary/20"
        >
          <h3 className="font-medium flex items-center gap-2">
            <span>✨</span> Get Personalized Startup Advice
          </h3>
          <p className="mt-2 text-muted-foreground mb-4">
            Complete your founder profile to get advice tailored to your specific startup needs
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-primary text-primary-foreground p-2 rounded-lg text-center"
          >
            <a href="/onboarding" className="text-sm font-medium flex items-center justify-center">
              Complete Your Profile →
            </a>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
