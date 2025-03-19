"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Filter, Cpu, MemoryStickIcon as Memory, HardDrive, Server, CheckCircle } from "lucide-react"

type VirtualMachine = {
  id: string
  name: string
  description: string
  specs: {
    cpu: string
    ram: string
    storage: string
    gpu?: string
    os: string
  }
  hourlyRate: number
  monthlyRate: number
  tags: string[]
  software: string[]
  available: boolean
}

export function VirtualMachinesCatalog() {
  const [vms, setVMs] = useState<VirtualMachine[]>([])
  const [filteredVMs, setFilteredVMs] = useState<VirtualMachine[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null)
  const [billingCycle, setBillingCycle] = useState<"hourly" | "monthly">("monthly")
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [duration, setDuration] = useState<number>(1) // months
  const [isLoading, setIsLoading] = useState(true)
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false)
  const [isRentSuccess, setIsRentSuccess] = useState(false)

  // Filter options
  const [cpuFilter, setCpuFilter] = useState<string | null>(null)
  const [ramFilter, setRamFilter] = useState<string | null>(null)
  const [gpuFilter, setGpuFilter] = useState<boolean>(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  useEffect(() => {
    // In a real app, this would be an API call
    const demoVMs = [
      {
        id: "vm1",
        name: "Basic Development Environment",
        description: "A lightweight virtual machine for web development and basic programming tasks.",
        specs: {
          cpu: "2 vCPUs",
          ram: "4 GB",
          storage: "50 GB SSD",
          os: "Ubuntu 22.04 LTS",
        },
        hourlyRate: 0.05,
        monthlyRate: 25,
        tags: ["web development", "programming", "beginner"],
        software: ["Node.js", "Python", "Git", "VS Code", "Docker"],
        available: true,
      },
      {
        id: "vm2",
        name: "Data Science Workstation",
        description:
          "Optimized for data analysis and machine learning tasks. Includes popular data science libraries and frameworks.",
        specs: {
          cpu: "4 vCPUs",
          ram: "16 GB",
          storage: "100 GB SSD",
          os: "Ubuntu 22.04 LTS",
        },
        hourlyRate: 0.15,
        monthlyRate: 75,
        tags: ["data science", "machine learning", "analytics"],
        software: ["Python", "R", "Jupyter", "TensorFlow", "PyTorch", "scikit-learn", "pandas"],
        available: true,
      },
      {
        id: "vm3",
        name: "GPU Compute Instance",
        description: "High-performance computing with GPU acceleration for deep learning and AI workloads.",
        specs: {
          cpu: "8 vCPUs",
          ram: "32 GB",
          storage: "200 GB SSD",
          gpu: "NVIDIA T4 (16 GB VRAM)",
          os: "Ubuntu 22.04 LTS",
        },
        hourlyRate: 0.6,
        monthlyRate: 300,
        tags: ["deep learning", "AI", "GPU", "high performance"],
        software: ["CUDA", "cuDNN", "TensorFlow", "PyTorch", "Keras", "JAX"],
        available: true,
      },
      {
        id: "vm4",
        name: "Full-Stack Development Server",
        description: "Complete environment for full-stack web application development and testing.",
        specs: {
          cpu: "4 vCPUs",
          ram: "8 GB",
          storage: "100 GB SSD",
          os: "Ubuntu 22.04 LTS",
        },
        hourlyRate: 0.1,
        monthlyRate: 50,
        tags: ["web development", "full-stack", "deployment"],
        software: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Redis", "Docker", "Nginx"],
        available: true,
      },
      {
        id: "vm5",
        name: "High-Performance Computing Cluster",
        description: "Distributed computing environment for large-scale data processing and scientific computing.",
        specs: {
          cpu: "16 vCPUs",
          ram: "64 GB",
          storage: "500 GB SSD",
          os: "Ubuntu 22.04 LTS",
        },
        hourlyRate: 0.9,
        monthlyRate: 450,
        tags: ["HPC", "scientific computing", "big data"],
        software: ["Apache Spark", "Hadoop", "MPI", "OpenMP", "SLURM"],
        available: true,
      },
      {
        id: "vm6",
        name: "Game Development Workstation",
        description: "Optimized for game development with GPU acceleration and game engines pre-installed.",
        specs: {
          cpu: "8 vCPUs",
          ram: "16 GB",
          storage: "250 GB SSD",
          gpu: "NVIDIA T4 (16 GB VRAM)",
          os: "Windows Server 2022",
        },
        hourlyRate: 0.4,
        monthlyRate: 200,
        tags: ["game development", "3D rendering", "GPU"],
        software: ["Unity", "Unreal Engine", "Blender", "Visual Studio", "Git LFS"],
        available: true,
      },
    ]

    setVMs(demoVMs)
    setFilteredVMs(demoVMs)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = [...vms]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (vm) =>
          vm.name.toLowerCase().includes(query) ||
          vm.description.toLowerCase().includes(query) ||
          vm.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          vm.software.some((sw) => sw.toLowerCase().includes(query)),
      )
    }

    // Apply CPU filter
    if (cpuFilter) {
      const cpuCount = Number.parseInt(cpuFilter)
      filtered = filtered.filter((vm) => {
        const vmCpuCount = Number.parseInt(vm.specs.cpu.split(" ")[0])
        return vmCpuCount >= cpuCount
      })
    }

    // Apply RAM filter
    if (ramFilter) {
      const ramSize = Number.parseInt(ramFilter)
      filtered = filtered.filter((vm) => {
        const vmRamSize = Number.parseInt(vm.specs.ram.split(" ")[0])
        return vmRamSize >= ramSize
      })
    }

    // Apply GPU filter
    if (gpuFilter) {
      filtered = filtered.filter((vm) => vm.specs.gpu !== undefined)
    }

    // Apply price filter
    filtered = filtered.filter((vm) => {
      const price = billingCycle === "monthly" ? vm.monthlyRate : vm.hourlyRate
      return price >= priceRange[0] && price <= priceRange[1]
    })

    setFilteredVMs(filtered)
  }, [searchQuery, cpuFilter, ramFilter, gpuFilter, priceRange, billingCycle, vms])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleRentVM = (vm: VirtualMachine) => {
    setSelectedVM(vm)
    setIsRentDialogOpen(true)
    setIsRentSuccess(false)
  }

  const confirmRent = () => {
    // In a real app, this would call an API to rent the VM
    console.log(
      `Renting VM: ${selectedVM?.id}, Billing: ${billingCycle}, Start: ${startDate}, Duration: ${duration} months`,
    )

    // Simulate success
    setTimeout(() => {
      setIsRentSuccess(true)
    }, 1000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: billingCycle === "hourly" ? 2 : 0,
    }).format(amount)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading virtual machines...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search virtual machines..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Virtual Machines</DialogTitle>
              <DialogDescription>
                Customize your search to find the perfect virtual machine for your needs.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Minimum CPU Cores</Label>
                <Select value={cpuFilter || ""} onValueChange={setCpuFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="2">2+ vCPUs</SelectItem>
                    <SelectItem value="4">4+ vCPUs</SelectItem>
                    <SelectItem value="8">8+ vCPUs</SelectItem>
                    <SelectItem value="16">16+ vCPUs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum RAM</Label>
                <Select value={ramFilter || ""} onValueChange={setRamFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="4">4+ GB</SelectItem>
                    <SelectItem value="8">8+ GB</SelectItem>
                    <SelectItem value="16">16+ GB</SelectItem>
                    <SelectItem value="32">32+ GB</SelectItem>
                    <SelectItem value="64">64+ GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="gpu-filter" checked={gpuFilter} onCheckedChange={setGpuFilter} />
                <Label htmlFor="gpu-filter">GPU Required</Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Price Range ({billingCycle === "monthly" ? "Monthly" : "Hourly"})</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={billingCycle === "monthly" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBillingCycle("monthly")}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={billingCycle === "hourly" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBillingCycle("hourly")}
                    >
                      Hourly
                    </Button>
                  </div>
                </div>
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[0, 500]}
                    max={billingCycle === "monthly" ? 500 : 1}
                    step={billingCycle === "monthly" ? 25 : 0.05}
                    value={priceRange}
                    onValueChange={setPriceRange as any}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCpuFilter(null)
                  setRamFilter(null)
                  setGpuFilter(false)
                  setPriceRange([0, 500])
                }}
              >
                Reset
              </Button>
              <Button type="submit">Apply Filters</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVMs.map((vm) => (
          <Card key={vm.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{vm.name}</CardTitle>
              <CardDescription>{vm.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{vm.specs.cpu}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Memory className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{vm.specs.ram}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{vm.specs.storage}</span>
                    </div>
                    {vm.specs.gpu && (
                      <div className="flex items-center text-sm">
                        <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{vm.specs.gpu}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Software</h4>
                  <div className="flex flex-wrap gap-1">
                    {vm.software.slice(0, 5).map((sw, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {sw}
                      </Badge>
                    ))}
                    {vm.software.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{vm.software.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Pricing</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Hourly:</span>
                      <span className="font-medium ml-1">{formatCurrency(vm.hourlyRate)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Monthly:</span>
                      <span className="font-medium ml-1">{formatCurrency(vm.monthlyRate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleRentVM(vm)}>
                Rent Now
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredVMs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No virtual machines found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      <Dialog open={isRentDialogOpen} onOpenChange={setIsRentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rent Virtual Machine</DialogTitle>
            <DialogDescription>{selectedVM?.name}</DialogDescription>
          </DialogHeader>

          {!isRentSuccess ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={billingCycle === "monthly" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setBillingCycle("monthly")}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={billingCycle === "hourly" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setBillingCycle("hourly")}
                    >
                      Hourly
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {billingCycle === "monthly" && (
                  <div className="space-y-2">
                    <Label>Duration (months)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        defaultValue={[1]}
                        max={12}
                        step={1}
                        value={[duration]}
                        onValueChange={(value) => setDuration(value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{duration}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        billingCycle === "monthly" ? selectedVM?.monthlyRate || 0 : selectedVM?.hourlyRate || 0,
                      )}
                      {billingCycle === "monthly" ? "/month" : "/hour"}
                    </span>
                  </div>

                  {billingCycle === "monthly" && (
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>
                        {duration} month{duration !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Estimated total:</span>
                    <span>
                      {formatCurrency(
                        billingCycle === "monthly"
                          ? (selectedVM?.monthlyRate || 0) * duration
                          : (selectedVM?.hourlyRate || 0) * 24 * 30, // Estimate for 1 month of hourly usage
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmRent}>Confirm Rental</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Virtual Machine Rented Successfully!</h3>
                <p className="text-muted-foreground mt-1">
                  Your virtual machine will be available on {new Date(startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="pt-4">
                <Button onClick={() => setIsRentDialogOpen(false)}>View My Resources</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

