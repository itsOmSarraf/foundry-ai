import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">Startup Onboarding Platform</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Welcome to our platform for startups. Complete the onboarding process to get started with your startup journey.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Complete our multi-step onboarding process to tell us about your startup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our onboarding process will ask you about:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Your founder details</li>
                <li>Your startup idea</li>
                <li>Market information</li>
                <li>What help you need</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/onboarding">Start Onboarding</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                View your saved startup profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your profile contains all the information you've provided during onboarding:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Personal details</li>
                <li>Startup information</li>
                <li>Market preferences</li>
                <li>Help requests</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 