"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Download, CreditCard, Calendar, DollarSign } from "lucide-react"

export function VirtualMachinesUsage() {
  const [activeTab, setActiveTab] = useState("usage")
  const [isLoading, setIsLoading] = useState(true)

  // Demo data
  const usageData = [
    { name: "Jun 1", cpu: 45, ram: 60, storage: 30, gpu: 20 },
    { name: "Jun 2", cpu: 50, ram: 65, storage: 30, gpu: 25 },
    { name: "Jun 3", cpu: 60, ram: 70, storage: 32, gpu: 40 },
    { name: "Jun 4", cpu: 70, ram: 80, storage: 35, gpu: 55 },
    { name: "Jun 5", cpu: 65, ram: 75, storage: 38, gpu: 50 },
    { name: "Jun 6", cpu: 80, ram: 85, storage: 40, gpu: 70 },
    { name: "Jun 7", cpu: 90, ram: 90, storage: 45, gpu: 85 },
  ]

  const costData = [
    { name: "Jan", amount: 120 },
    { name: "Feb", amount: 150 },
    { name: "Mar", amount: 200 },
    { name: "Apr", amount: 180 },
    { name: "May", amount: 220 },
    { name: "Jun", amount: 300 },
  ]

  const resourceDistribution = [
    { name: "CPU", value: 45 },
    { name: "RAM", value: 30 },
    { name: "Storage", value: 15 },
    { name: "GPU", value: 10 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

  const invoices = [
    {
      id: "INV-001",
      date: "2023-06-01",
      amount: 120,
      status: "paid",
      description: "Monthly VM subscription - Basic Development Environment",
    },
    {
      id: "INV-002",
      date: "2023-05-01",
      amount: 120,
      status: "paid",
      description: "Monthly VM subscription - Basic Development Environment",
    },
    {
      id: "INV-003",
      date: "2023-04-01",
      amount: 120,
      status: "paid",
      description: "Monthly VM subscription - Basic Development Environment",
    },
    {
      id: "INV-004",
      date: "2023-06-15",
      amount: 180,
      status: "pending",
      description: "GPU Compute Instance - Hourly usage (300 hours)",
    },
  ]

  const paymentMethods = [
    {
      id: "pm-001",
      type: "credit_card",
      last4: "4242",
      expiry: "04/25",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: "pm-002",
      type: "credit_card",
      last4: "1234",
      expiry: "12/24",
      brand: "Mastercard",
      isDefault: false,
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading usage data...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="usage">Resource Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing & Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <CardDescription>Average: 65%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <Progress value={75} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
                <CardDescription>Average: 70%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Progress value={85} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <CardDescription>Average: 35%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <Progress value={45} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">GPU Usage</CardTitle>
                <CardDescription>Average: 50%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <Progress value={85} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Over Time</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cpu" name="CPU (%)" fill="#3b82f6" />
                    <Bar dataKey="ram" name="RAM (%)" fill="#10b981" />
                    <Bar dataKey="storage" name="Storage (%)" fill="#f59e0b" />
                    <Bar dataKey="gpu" name="GPU (%)" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>Current billing cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Cost"]} />
                      <Bar dataKey="amount" name="Cost ($)" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{formatCurrency(180)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Due on July 15, 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{formatCurrency(120)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Processed on June 1, 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billing Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">Monthly</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Next cycle: July 1, 2023</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b text-sm">
                  <div className="col-span-2">Invoice #</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1"></div>
                </div>

                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/50"
                  >
                    <div className="col-span-2 font-medium">{invoice.id}</div>
                    <div className="col-span-2 text-sm">{new Date(invoice.date).toLocaleDateString()}</div>
                    <div className="col-span-4 text-sm">{invoice.description}</div>
                    <div className="col-span-2 font-medium">{formatCurrency(invoice.amount)}</div>
                    <div className="col-span-1">{getStatusBadge(invoice.status)}</div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download invoice</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center mr-4">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {method.brand} •••• {method.last4}
                          {method.isDefault && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}

                <Button className="w-full">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>Your billing address for invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground mt-1">
                  123 Main Street
                  <br />
                  Apt 4B
                  <br />
                  San Francisco, CA 94103
                  <br />
                  United States
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Edit Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

