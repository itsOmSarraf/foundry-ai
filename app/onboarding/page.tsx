"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { onboardingSchema, OnboardingField } from "@/lib/schema"
import confetti from 'canvas-confetti'
import { User, Rocket, MapPin, HelpCircle, Settings, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { useOnboardingStore } from "@/lib/store/onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  
  // Get data from Zustand store
  const { data: storedData, setData, updateField } = useOnboardingStore()

  useEffect(() => {
    // Initialize form data from store
    if (Object.keys(storedData).length > 0) {
      setFormData(storedData)
    }
  }, [storedData])

  const totalSteps = onboardingSchema.steps.length
  const currentStep = onboardingSchema.steps[step]
  const progress = ((step + 1) / totalSteps) * 100

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Update field in store
    updateField(key, value)
  }

  const handleMultiSelect = (key: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[key] || []
      const valueExists = currentValues.includes(value)
      
      const newValues = valueExists 
        ? currentValues.filter((v: string) => v !== value) 
        : [...currentValues, value]
      
      // Update field in store
      updateField(key, newValues)
      
      return { ...prev, [key]: newValues }
    })
  }

  const handleNext = () => {
    const isValid = currentStep.fields.every((field: OnboardingField) => {
      return !field.required || formData[field.key]
    })

    if (!isValid) {
      alert("Please fill in all required fields")
      return
    }

    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Fire confetti multiple times for a better effect
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6, x: 0.3 }
      })
    }, 300)
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6, x: 0.7 }
      })
    }, 600)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setShowLoader(true)
    
    try {
      // Save data to store (this will automatically save to localStorage)
      setData(formData)
      
      // Fire confetti right away
      triggerConfetti()
      
      // Set timeout to navigate after 2 seconds
      setTimeout(() => {
        // Force hard navigation instead of client-side routing
        window.location.href = "/profile"
      }, 2000)
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Failed to save your data. Please try again.")
      setIsSubmitting(false)
      setShowLoader(false)
    }
  }

  // Get the appropriate icon for the current step
  const getStepIcon = () => {
    switch (step) {
      case 0: return <User className="h-6 w-6 text-primary" />
      case 1: return <Rocket className="h-6 w-6 text-primary" />
      case 2: return <MapPin className="h-6 w-6 text-primary" />
      case 3: return <HelpCircle className="h-6 w-6 text-primary" />
      case 4: return <Settings className="h-6 w-6 text-primary" />
      default: return <User className="h-6 w-6 text-primary" />
    }
  }

  // Determine if a field should be rendered in a side-by-side layout
  const shouldRenderSideBySide = (field: OnboardingField) => {
    return field.type === "text" || field.type === "select" || field.type === "country_select" || field.type === "toggle"
  }

  // Group fields that should be rendered side by side into pairs
  const getFieldPairs = () => {
    return currentStep.fields.reduce((pairs: OnboardingField[][], field, index, array) => {
      if (index % 2 === 0) {
        // Check if this field and the next one can be paired
        const nextField = array[index + 1]
        if (nextField && shouldRenderSideBySide(field) && shouldRenderSideBySide(nextField)) {
          pairs.push([field, nextField])
        } else {
          pairs.push([field])
        }
      } else if (index === array.length - 1 || !shouldRenderSideBySide(field) || !shouldRenderSideBySide(array[index - 1])) {
        // If this is the last field or couldn't be paired with the previous one
        pairs.push([field])
      }
      return pairs
    }, [])
  }

  // If we're in the submitting state, show a loader
  if (showLoader) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent className="flex flex-col items-center pt-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <CardTitle className="text-2xl mb-2">Generating Your Profile</CardTitle>
            <CardDescription className="text-lg">
              Please wait while we prepare your startup profile...
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="rounded-full bg-muted p-2.5">
            {getStepIcon()}
          </div>
          <div className="space-y-1.5">
            <CardTitle>{currentStep.title}</CardTitle>
            <CardDescription>
              Step {step + 1} of {totalSteps}
            </CardDescription>
          </div>
        </CardHeader>
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between p-4 border-b">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            {step === totalSteps - 1 ? (
              <>
                Submit <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <CardContent className="pt-6 pb-4">
          {getFieldPairs().map((fieldPair, pairIndex) => (
            <div 
              key={pairIndex} 
              className={`grid ${fieldPair.length > 1 ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1'} mb-6`}
            >
              {fieldPair.map((field: OnboardingField) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="flex items-center">
                    {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required={field.required}
                      className="w-full"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required={field.required}
                      rows={4}
                      className="w-full"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}

                  {field.type === "select" && (
                    <Select 
                      value={formData[field.key] || ""} 
                      onValueChange={(value) => handleInputChange(field.key, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "multiselect" && (
                    <div className="space-y-3 max-h-60 overflow-y-auto p-2 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {field.options?.map((option: string) => (
                          <div key={option} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                            <Checkbox 
                              id={`${field.key}-${option}`}
                              checked={(formData[field.key] || []).includes(option)}
                              onCheckedChange={() => handleMultiSelect(field.key, option)}
                            />
                            <label 
                              htmlFor={`${field.key}-${option}`}
                              className="text-sm font-medium leading-none cursor-pointer select-none"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {field.type === "country_select" && (
                    <Select 
                      value={formData[field.key] || ""} 
                      onValueChange={(value) => handleInputChange(field.key, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {["United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Japan", "China", "Brazil", "Other"].map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.type === "toggle" && (
                    <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor={field.key}>{field.label}</Label>
                      </div>
                      <Switch
                        id={field.key}
                        checked={formData[field.key] ?? field.default ?? false}
                        onCheckedChange={(checked) => handleInputChange(field.key, checked)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 