import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { myProvider } from '@/lib/ai/providers';

// AI document generation prompts
const documentPrompts: Record<string, string> = {
  "business-model": "Generate a detailed business model canvas for a startup. Include sections for: Key Partners, Key Activities, Value Propositions, Customer Relationships, Customer Segments, Key Resources, Channels, Cost Structure, and Revenue Streams. Format as markdown with appropriate headers and bullet points.",
  
  "profit-projection": "Create a 12-month profit projection for a startup. Include monthly estimates for revenue streams, operating costs, marketing expenses, and development costs. Calculate the break-even point and total profit/loss. Format as markdown with tables and explanations.",
  
  "executive-summary": "Write a concise one-page executive summary for a startup. Include the problem, solution, target market, competitive advantage, business model, and team background. Format as markdown with appropriate sections.",
  
  "vc-email-drafts": "Draft three email templates for approaching venture capitalists: 1) A cold outreach email, 2) A follow-up email after a pitch, and 3) A thank-you email after receiving funding. Each email should be concise, compelling, and highlight the startup's unique value proposition. Format as markdown with clear separation between templates.",
  
  "market-analysis": "Create a comprehensive market analysis for a startup. Include market size, growth rate, key competitors, competitive advantages, target customer segments, and potential market share. Add sections for market trends, entry barriers, and regulatory considerations. Format as markdown with appropriate headers and bullet points.",
  
  "govt-scheme-checklist": "Generate a checklist of government requirements, regulations, and support schemes relevant to a startup. Include information on business registration, tax incentives, funding opportunities, and compliance requirements. Format as markdown with clear sections and checkboxes.",
};

// Document titles for the response
const documentTitles: Record<string, string> = {
  "business-model": "Business Model Canvas",
  "profit-projection": "Profit Projection (12 Months)",
  "executive-summary": "Executive Summary",
  "vc-email-drafts": "VC Email Templates",
  "market-analysis": "Market Analysis Report",
  "govt-scheme-checklist": "Government Scheme Checklist",
};

export async function POST(request: Request) {
  try {
    const { documentId, startupDetails } = await request.json();
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get the appropriate prompt for the requested document
    const basePrompt = documentPrompts[documentId];
    if (!basePrompt) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Create a system prompt for the AI
    const systemPrompt = `You are a specialized AI designed to generate high-quality, professional startup documentation.
Your task is to create a ${documentTitles[documentId]} that is:
- Detailed and comprehensive
- Tailored specifically to the startup details provided
- Formatted in clean markdown
- Organized with clear sections and structure
- Based on industry best practices
- Practical and immediately useful to the founder

Respond ONLY with the document content in proper markdown format. Do not include any explanations, introductions, or comments outside the document itself.`;

    // Create the final prompt with startup details if provided
    let finalPrompt = basePrompt;
    if (startupDetails && startupDetails.trim() !== "") {
      // Check if we have profile data or the default message
      if (startupDetails.includes("No profile data available")) {
        // Minimal details case
        finalPrompt = `${basePrompt}\n\nNote: The user hasn't provided specific startup details. Please generate a generic document that would be useful for most early-stage startups.`;
      } else {
        // Format profile data nicely
        finalPrompt = `${basePrompt}\n\n## STARTUP PROFILE:\n${startupDetails}\n\nCreate a customized document based on the startup profile above.`;
      }
    }

    // Generate content using the artifact model
    const { text: generatedContent } = await generateText({
      model: myProvider.languageModel('artifact-model'),
      system: systemPrompt,
      prompt: finalPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Format the response
    const title = documentTitles[documentId] || 'Generated Document';
    const formattedContent = `# ${title}\n\n${generatedContent}`;

    return NextResponse.json({
      success: true,
      documentId,
      content: formattedContent,
    });

  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
} 