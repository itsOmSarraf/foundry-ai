export type OnboardingField = {
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'country_select' | 'toggle';
  key: string;
  required: boolean;
  options?: string[];
  default?: boolean;
};

export type OnboardingStep = {
  title: string;
  fields: OnboardingField[];
};

export type OnboardingSchema = {
  steps: OnboardingStep[];
};

export const onboardingSchema: OnboardingSchema = {
  steps: [
    {
      title: "Founder Info",
      fields: [
        {
          label: "What's your name?",
          type: "text",
          key: "founder_name",
          required: true
        },
        {
          label: "What best describes your role?",
          type: "select",
          key: "founder_role",
          required: true,
          options: [
            "Solo Founder",
            "Technical Co-founder",
            "Non-Technical Founder",
            "Student",
            "Just exploring"
          ]
        }
      ]
    },
    {
      title: "Startup Basics",
      fields: [
        {
          label: "Startup Name",
          type: "text",
          key: "startup_name",
          required: false
        },
        {
          label: "What's your startup idea in one line?",
          type: "textarea",
          key: "idea_one_liner",
          required: true
        },
        {
          label: "Describe your startup idea in more detail",
          type: "textarea",
          key: "idea_description",
          required: false
        },
        {
          label: "What stage are you currently in?",
          type: "select",
          key: "startup_stage",
          required: true,
          options: [
            "Idea",
            "MVP",
            "Pre-seed",
            "Seed",
            "Growth",
            "Scaling",
            "Just exploring"
          ]
        },
        {
          label: "What industry/domain is your startup in?",
          type: "multiselect",
          key: "startup_industry",
          required: true,
          options: [
            "Fintech",
            "Edtech",
            "AI/ML",
            "E-commerce",
            "Health",
            "Climate",
            "SaaS",
            "Others"
          ]
        },
        {
          label: "Who is your target audience?",
          type: "multiselect",
          key: "target_audience",
          required: false,
          options: [
            "Consumers",
            "Businesses",
            "Startups",
            "Students",
            "Developers"
          ]
        }
      ]
    },
    {
      title: "Market & Location",
      fields: [
        {
          label: "What is your target market location?",
          type: "country_select",
          key: "market_location",
          required: true
        },
        {
          label: "What is your local language or culture focus (if any)?",
          type: "text",
          key: "localization",
          required: false
        }
      ]
    },
    {
      title: "What Help Do You Need?",
      fields: [
        {
          label: "What do you need help with right now?",
          type: "multiselect",
          key: "help_needed",
          required: true,
          options: [
            "Validate my idea",
            "Competitor research",
            "Find co-founder or team",
            "Find investors/incubators",
            "Build MVP / tech suggestions",
            "Profit or business model",
            "Legal or company registration",
            "Localization",
            "Market/VC analysis",
            "Scalability/Feasibility",
            "Others"
          ]
        }
      ]
    },
    {
      title: "Optional Setup",
      fields: [
        {
          label: "Would you like the AI to help improve your idea description?",
          type: "toggle",
          key: "ai_improve_idea",
          required: false,
          default: true
        },
        {
          label: "Do you want to receive weekly startup progress nudges/reminders?",
          type: "toggle",
          key: "enable_reminders",
          required: false,
          default: false
        }
      ]
    }
  ]
}; 