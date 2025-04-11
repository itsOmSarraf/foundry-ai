"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { onboardingSchema } from "@/lib/schema"
import { User, Rocket, MapPin, HelpCircle, Settings, Edit, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useOnboardingStore } from "@/lib/store/onboarding"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  
  // Use useState variables to properly handle hydration
  const [storeLoaded, setStoreLoaded] = useState(false)
  const [isRendering, setIsRendering] = useState(true)
  
  // Get data directly from the Zustand store using the hook pattern
  const onboardingData = useOnboardingStore(state => state.data)
  
  // Effect to handle store hydration
  useEffect(() => {
    // Set storeLoaded to true after initial hydration
    setStoreLoaded(true)
    
    // Create a small delay to ensure UI renders smoothly
    const timer = setTimeout(() => {
      setIsRendering(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Determine if we have valid data after hydration
  const hasData = storeLoaded && onboardingData && Object.keys(onboardingData).length > 0

  const handleEditProfile = () => {
    router.push("/onboarding")
  }

  // Get the appropriate icon for a section
  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0: return <User className="h-5 w-5 text-primary" />
      case 1: return <Rocket className="h-5 w-5 text-primary" />
      case 2: return <MapPin className="h-5 w-5 text-primary" />
      case 3: return <HelpCircle className="h-5 w-5 text-primary" />
      case 4: return <Settings className="h-5 w-5 text-primary" />
      default: return <User className="h-5 w-5 text-primary" />
    }
  }

  // Show loading state while the store is hydrating
  if (isRendering) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Loading profile data...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait while we retrieve your information</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show empty state if no data is found
  if (!hasData) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Profile Not Found</CardTitle>
            </div>
            <CardDescription>You haven&apos;t completed the onboarding process yet.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
              <p>Complete your founder profile to get advice tailored to your specific startup needs. This information helps the AI provide more personalized responses.</p>
            </div>
          </CardContent>
          <CardFooter className="pt-4 flex gap-2">
            <Button onClick={handleEditProfile} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Complete Profile
            </Button>
            <Button asChild variant="outline">
              <Link href="/test-store">Go to Test Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderFieldValue = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-muted-foreground italic">Not provided</span>
    }

    // Find the field definition from the schema
    let fieldDef
    for (const step of onboardingSchema.steps) {
      const found = step.fields.find(field => field.key === key)
      if (found) {
        fieldDef = found
        break
      }
    }

    if (!fieldDef) {
      return <span>{String(value)}</span>
    }

    if (fieldDef.type === "multiselect" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item: string) => (
            <Badge key={item} variant="outline" className="bg-primary/10">
              {item}
            </Badge>
          ))}
        </div>
      )
    }

    if (fieldDef.type === "toggle") {
      return (
        <Badge variant={value ? "default" : "outline"} className={value ? "bg-green-500/80" : ""}>
          {value ? "Yes" : "No"}
        </Badge>
      )
    }

    return <span>{String(value)}</span>
  }

  // Get initials from founder name for the avatar
  const getInitials = () => {
    const name = onboardingData.founder_name || "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {onboardingData.founder_name ? (
                    <>
                      {onboardingData.founder_name}
                      <span>{"\u2019"}</span>
                      s Profile
                    </>
                  ) : "Your Profile"}
                </CardTitle>
                <CardDescription className="text-base">
                  {onboardingData.startup_name ? onboardingData.startup_name : "Startup Onboarding Information"}
                </CardDescription>
                {onboardingData.founder_role && (
                  <Badge className="mt-1">{onboardingData.founder_role}</Badge>
                )}
              </div>
            </div>
            <Badge className="bg-green-500 flex items-center gap-1 py-1 hidden md:flex">
              <CheckCircle className="h-3 w-3" />
              Profile Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-6">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-blue-800 text-sm flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">How this information is used:</p>
              <p className="mt-1">This profile data is automatically included with your chat messages to provide personalized responses tailored to your startup&apos;s specific needs and stage.</p>
            </div>
          </div>
          
          {onboardingSchema.steps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  {getSectionIcon(index)}
                </div>
                <h3 className="text-lg font-medium">{step.title}</h3>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {step.fields.map(field => (
                  <div key={field.key} className="p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
                    <div className="text-sm text-muted-foreground mb-1">{field.label}</div>
                    <div className="font-medium">
                      {renderFieldValue(field.key, onboardingData[field.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-4 border-t flex flex-wrap gap-2 justify-between">
          <Button 
            onClick={handleEditProfile} 
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/chat/test">Try in Chat</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/test-store">Test Store</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 