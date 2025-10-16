"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { mockDonations, categoryLabels } from "@/lib/donations-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Calendar, Package, User, ArrowLeft, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function DonationDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isReserving, setIsReserving] = useState(false)

  const donation = mockDonations.find((d) => d.id === resolvedParams.id)

  if (!donation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Donation not found</CardTitle>
              <CardDescription>The donation you're looking for doesn't exist or has been removed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/donations">View all donations</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const handleReserve = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to reserve a donation.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsReserving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Donation reserved!",
        description: "Contact the donor to arrange collection.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error reserving",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsReserving(false)
    }
  }

  const getStatusBadge = (status: typeof donation.status) => {
    const variants = {
      available: "default",
      reserved: "secondary",
      collected: "outline",
    } as const

    const labels = {
      available: "Available",
      reserved: "Reserved",
      collected: "Collected",
    }

    return (
      <Badge variant={variants[status]} className="capitalize">
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/donations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to donations
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image
                  src={donation.image || "/placeholder.svg"}
                  alt={donation.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl font-bold text-balance">{donation.title}</h1>
                  {getStatusBadge(donation.status)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{donation.location}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{donation.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{new Date(donation.expiryDate).toLocaleDateString("en-US")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Donor</p>
                    <p className="font-medium">{donation.donorName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <Badge variant="secondary">{categoryLabels[donation.category]}</Badge>
                </div>

                {donation.reservedBy && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reserved by</p>
                    <p className="font-medium">{donation.reservedBy}</p>
                  </div>
                )}
              </div>

              <Separator />

              {donation.status === "available" ? (
                <Button onClick={handleReserve} disabled={isReserving} className="w-full" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  {isReserving ? "Reserving..." : "Reserve Donation"}
                </Button>
              ) : (
                <Button disabled className="w-full" size="lg">
                  Donation Unavailable
                </Button>
              )}

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    By reserving this donation, you commit to collecting the food within the timeframe agreed with the donor.
                    Contact them through the dashboard after reservation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function DonationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthProvider>
      <DonationDetailContent params={params} />
    </AuthProvider>
  )
}