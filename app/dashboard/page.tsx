"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { mockDonations } from "@/lib/donations-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Heart, Package, Users, TrendingUp, MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  // Filter donations based on user role
  const userDonations =
    user.role === "donor"
      ? mockDonations.filter((d) => d.donorId === user.id)
      : mockDonations.filter((d) => d.reservedBy === user.name || d.status === "available")

  const stats = {
    totalDonations: user.role === "donor" ? 12 : 8,
    activeDonations: user.role === "donor" ? 5 : 3,
    completedDonations: user.role === "donor" ? 7 : 5,
    impactedPeople: user.role === "donor" ? 156 : 89,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-2">Hello, {user.name.split(" ")[0]}!</h1>
              <p className="text-lg text-muted-foreground">
                {user.role === "donor"
                  ? "Manage your donations and see the impact you're making"
                  : "See available donations and manage your reservations"}
              </p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "donor" ? "Total Donations" : "Received Donations"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
                <p className="text-xs text-muted-foreground">+2 since last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "donor" ? "Active Donations" : "Active Reservations"}
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDonations}</div>
                <p className="text-xs text-muted-foreground">Awaiting collection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "donor" ? "Completed Donations" : "Completed Collections"}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedDonations}</div>
                <p className="text-xs text-muted-foreground">+58% since start</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impacted People</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.impactedPeople}</div>
                <p className="text-xs text-muted-foreground">Estimate based on donations</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Donations List */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="active" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="active">{user.role === "donor" ? "Active" : "Available"}</TabsTrigger>
                    <TabsTrigger value="completed">
                      {user.role === "donor" ? "Completed" : "My Reservations"}
                    </TabsTrigger>
                  </TabsList>
                  {user.role === "donor" && (
                    <Button asChild>
                      <Link href="/donations/new">New Donation</Link>
                    </Button>
                  )}
                </div>

                <TabsContent value="active" className="space-y-4">
                  {userDonations
                    .filter((d) => (user.role === "donor" ? d.status !== "collected" : d.status === "available"))
                    .slice(0, 5)
                    .map((donation) => (
                      <Card key={donation.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={donation.image || "/placeholder.svg"}
                                alt={donation.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-balance">{donation.title}</h3>
                                <Badge variant={donation.status === "available" ? "default" : "secondary"}>
                                  {donation.status === "available" ? "Available" : "Reserved"}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{donation.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Expiry: {new Date(donation.expiryDate).toLocaleDateString("en-US")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{donation.quantity}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/donations/${donation.id}`}>View Details</Link>
                                </Button>
                                {user.role === "donor" && (
                                  <>
                                    <Button size="sm" variant="ghost">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {userDonations
                    .filter((d) => (user.role === "donor" ? d.status === "collected" : d.reservedBy === user.name))
                    .slice(0, 5)
                    .map((donation) => (
                      <Card key={donation.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={donation.image || "/placeholder.svg"}
                                alt={donation.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-balance">{donation.title}</h3>
                                <Badge variant="outline">{user.role === "donor" ? "Collected" : "Reserved"}</Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{donation.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{donation.quantity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account type</p>
                    <Badge variant="secondary" className="capitalize">
                      {user.role === "donor" ? "Donor" : "Shelter/NGO"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-sm">{user.location || "Not informed"}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Impact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>
                    {user.role === "donor" ? "See the difference you're making" : "Food received this month"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Goal</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Kg donated</span>
                      <span className="font-medium">127kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated meals</span>
                      <span className="font-medium">423</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">CO₂ saved</span>
                      <span className="font-medium">89kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.role === "donor" ? (
                    <>
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/donations/new">
                          <Package className="mr-2 h-4 w-4" />
                          New Donation
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/donations">
                          <Heart className="mr-2 h-4 w-4" />
                          View All Donations
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/donations">
                          <Package className="mr-2 h-4 w-4" />
                          Search Donations
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/dashboard">
                          <Heart className="mr-2 h-4 w-4" />
                          My Reservations
                        </Link>
                      </Button>
                    </>
                  )}
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

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}