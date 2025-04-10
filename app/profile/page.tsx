"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { onboardingSchema } from "@/lib/schema"
import { User, Rocket, MapPin, HelpCircle, Settings, Edit, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    try {
      const storedData = localStorage.getItem("onboardingData")
      if (storedData) {
        setProfileData(JSON.parse(storedData))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Loading profile data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>You haven't completed the onboarding process yet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleEditProfile} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Complete Onboarding
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

    return <span className="text-primary-foreground">{String(value)}</span>
  }

  // Get initials from founder name for the avatar
  const getInitials = () => {
    const name = profileData.founder_name || "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex justify-center items-start py-10 px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {profileData.founder_name ? `${profileData.founder_name}'s Profile` : "Your Profile"}
              </CardTitle>
              <CardDescription className="text-base">
                {profileData.startup_name ? profileData.startup_name : "Startup Onboarding Information"}
              </CardDescription>
              {profileData.founder_role && (
                <Badge className="mt-1">{profileData.founder_role}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-6">
          {onboardingSchema.steps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-muted p-1.5">
                  {getSectionIcon(index)}
                </div>
                <h3 className="text-lg font-medium">{step.title}</h3>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {step.fields.map(field => (
                  <div key={field.key} className="p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
                    <div className="text-sm text-muted-foreground mb-1">{field.label}</div>
                    <div className="font-medium">
                      {renderFieldValue(field.key, profileData[field.key])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <Button 
            onClick={handleEditProfile} 
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 