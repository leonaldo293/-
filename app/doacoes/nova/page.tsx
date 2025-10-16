"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Donation } from "@/lib/donations-data"

function NewDonationForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "" as Donation["category"],
    quantity: "",
    expiryDate: "",
    location: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Donation created successfully!",
        description: "Your donation has been published and is available for reservation.",
      })

      router.push("/donations")
    } catch (error) {
      toast({
        title: "Error creating donation",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Restricted Access</CardTitle>
              <CardDescription>You need to be logged in to create a donation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/donations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to donations
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">New Donation</CardTitle>
              <CardDescription>Fill in the details of your food donation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Donation Title *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Assorted Fresh Fruits"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      disabled={isLoading}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="proteins">Proteins</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      placeholder="Ex: 5kg or 20 units"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Flower Street, 123 - São Paulo, SP"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add additional information about the donation..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    disabled={isLoading}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1 bg-transparent"
                    disabled={isLoading}
                  >
                    <Link href="/donations">Cancel</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Donation"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function NewDonationPage() {
  return (
    <AuthProvider>
      <NewDonationForm />
    </AuthProvider>
  )
}