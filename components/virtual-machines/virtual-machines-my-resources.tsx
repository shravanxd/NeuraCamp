"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  HardDrive,
  Cpu,
  MemoryStickIcon as Memory,
  Clock,
  Calendar,
  MoreVertical,
  Terminal,
  MonitorPlay,
  ExternalLink,
  Cloud,
  Info,
  Copy,
  Check,
} from "lucide-react"

// Define VM type
type VM = {
  id: string
  name: string
  status: string
  startTime: string
  duration: number
  specs: {
    cpu: number
    ram: number
    storage: number
  }
  ipAddress?: string
}

export function VirtualMachinesMyResources() {
  // Demo data for active VMs
  const demoActiveVMs: VM[] = [
    {
      id: "vm1",
      name: "Data Science Workstation",
      status: "running",
      startTime: "2023-07-15T09:30:00Z",
      duration: 24,
      specs: {
        cpu: 4,
        ram: 16,
        storage: 100,
      },
      ipAddress: "10.0.1.5",
    },
    {
      id: "vm2",
      name: "GPU Compute Instance",
      status: "stopped",
      startTime: "2023-07-10T14:00:00Z",
      duration: 72,
      specs: {
        cpu: 8,
        ram: 32,
        storage: 200,
      },
      ipAddress: "10.0.1.6",
    },
  ]

  // Demo data for scheduled VMs
  const demoScheduledVMs: VM[] = [
    {
      id: "vm3",
      name: "High-Performance Computing Cluster",
      status: "scheduled",
      startTime: "2023-07-25T08:00:00Z",
      duration: 0,
      specs: {
        cpu: 16,
        ram: 64,
        storage: 500,
      },
    },
  ]

  // Demo data for past VMs
  const demoPastVMs: VM[] = [
    {
      id: "vm4",
      name: "Web Development Environment",
      status: "completed",
      startTime: "2023-06-05T10:00:00Z",
      duration: 48,
      specs: {
        cpu: 2,
        ram: 8,
        storage: 50,
      },
    },
    {
      id: "vm5",
      name: "Database Server",
      status: "completed",
      startTime: "2023-06-20T12:00:00Z",
      duration: 120,
      specs: {
        cpu: 4,
        ram: 16,
        storage: 200,
      },
    },
  ]

  const [activeRentals, setActiveRentals] = useState<VM[]>(demoActiveVMs)
  const [scheduledRentals, setScheduledRentals] = useState<VM[]>(demoScheduledVMs)
  const [pastRentals, setPastRentals] = useState<VM[]>(demoPastVMs)

  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [selectedVM, setSelectedVM] = useState<VM | null>(null)
  const [connectionType, setConnectionType] = useState<"ssh" | "web">("web")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAwsInfoDialogOpen, setIsAwsInfoDialogOpen] = useState(false)
  const [scriptCopied, setScriptCopied] = useState(false)

  // Store the VM connection URLs in variables for easy updating
  const vmConnectionUrl =
    "https://116.105.105.17:33018/?token=9575e4186c67125ecd72b9908cf360ae937e789e3733684a58c0a2aba236bdd8"

  // Try adding an auto parameter to the URL (this may or may not work depending on AWS implementation)
  const awsConnectionUrl =
    "https://us-west-1.console.aws.amazon.com/systems-manager/fleet-manager/remote-desktop?nodeIds=i-0c66814bdcbdb5437&region=us-west-1&authType=USER_CREDENTIALS&autoConnect=true"

  // The script to find and click the connect button based on the provided HTML
  const autoClickScript = `setTimeout(() => {
  // Try to find the connect button by its text content and class
  const connectButtons = Array.from(document.querySelectorAll('span.awsui_content_vjswe_lssc8_153.awsui_label_1f1d4_ocied_5')).filter(el => el.textContent === 'Connect');
  
  if (connectButtons.length > 0) {
    // Find the closest button element
    const button = connectButtons[0].closest('button');
    if (button) {
      button.click();
      console.log('Connect button clicked automatically');
    } else {
      console.log('Button element not found');
    }
  } else {
    // Fallback to other selectors
    const fallbackButton = document.querySelector('button[data-testid="connect-button"]') || 
                          document.querySelector('button:contains("Connect")');
    if (fallbackButton) {
      fallbackButton.click();
      console.log('Connect button clicked using fallback selector');
    } else {
      console.log('Connect button not found with any selector');
    }
  }
}, 3000);`

  const handleConnect = (vm: VM, type: "ssh" | "web") => {
    setSelectedVM(vm)
    setConnectionType(type)
    setIsConnectDialogOpen(true)
    setIsConnected(false)
  }

  const establishConnection = () => {
    setIsConnecting(true)
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 1500)
  }

  const openInNewTab = (url: string = vmConnectionUrl) => {
    // Open the AWS console in a new window
    const newWindow = window.open(url, "_blank", "noopener,noreferrer")

    // Show the info dialog with instructions
    setIsAwsInfoDialogOpen(true)
  }

  const connectToAWS = () => {
    openInNewTab(awsConnectionUrl)
  }

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(autoClickScript).then(() => {
      setScriptCopied(true)
      setTimeout(() => setScriptCopied(false), 2000)
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500">Running</Badge>
      case "stopped":
        return <Badge className="bg-red-500">Stopped</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderVMTable = (vms: VM[], showActions = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specs</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {vms.map((vm) => (
          <TableRow key={vm.id}>
            <TableCell className="font-medium">{vm.name}</TableCell>
            <TableCell>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-sm">
                  <Cpu className="mr-2 h-4 w-4" /> {vm.specs.cpu} vCPUs
                </div>
                <div className="flex items-center text-sm">
                  <Memory className="mr-2 h-4 w-4" /> {vm.specs.ram} GB RAM
                </div>
                <div className="flex items-center text-sm">
                  <HardDrive className="mr-2 h-4 w-4" /> {vm.specs.storage} GB SSD
                </div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(vm.status)}</TableCell>
            <TableCell>
              <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> {formatDate(vm.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" /> {vm.duration} hours
                </div>
              </div>
            </TableCell>
            {showActions && (
              <TableCell className="text-right">
                {vm.status === "running" ? (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleConnect(vm, "ssh")}>
                      <Terminal className="mr-2 h-4 w-4" />
                      SSH
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleConnect(vm, "web")}>
                      <MonitorPlay className="mr-2 h-4 w-4" />
                      Console
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {vm.status === "stopped" && <DropdownMenuItem>Start VM</DropdownMenuItem>}
                      {vm.status === "scheduled" && <DropdownMenuItem>Cancel Reservation</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      {/* AWS Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <CardTitle>AWS Remote Desktop</CardTitle>
            </div>
            <Badge className="bg-blue-500">Active</Badge>
          </div>
          <CardDescription>Amazon EC2 instance with Windows Server 2022</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Instance Details</h4>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Cpu className="mr-2 h-4 w-4 text-muted-foreground" /> 4 vCPUs
                </div>
                <div className="flex items-center text-sm">
                  <Memory className="mr-2 h-4 w-4 text-muted-foreground" /> 16 GB RAM
                </div>
                <div className="flex items-center text-sm">
                  <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" /> 100 GB SSD
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Connection Info</h4>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">Region:</span> us-west-1
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">Instance ID:</span> i-0c66814bdcbdb5437
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">Status:</span> Running
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full" onClick={connectToAWS}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Connect to AWS Remote Desktop
          </Button>
        </CardFooter>
      </Card>

      {/* Regular VMs Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Virtual Machines</CardTitle>
          <CardDescription>Manage your active, scheduled, and past virtual machine rentals</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active ({activeRentals.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledRentals.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastRentals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {activeRentals.length > 0 ? (
                renderVMTable(activeRentals)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any active virtual machines.
                </div>
              )}
            </TabsContent>
            <TabsContent value="scheduled">
              {scheduledRentals.length > 0 ? (
                renderVMTable(scheduledRentals)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any scheduled virtual machines.
                </div>
              )}
            </TabsContent>
            <TabsContent value="past">
              {pastRentals.length > 0 ? (
                renderVMTable(pastRentals, false)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any past virtual machine rentals.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Regular VM Connect Dialog */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Connect to {selectedVM?.name} via {connectionType === "ssh" ? "SSH Terminal" : "Web Console"}
            </DialogTitle>
            <DialogDescription>
              {isConnected
                ? `You are now connected to ${selectedVM?.name}. You can open the connection in a new tab.`
                : `Establish a secure connection to your virtual machine.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            {!isConnected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-sm font-medium">Host</h3>
                    <p className="text-sm">{selectedVM?.ipAddress || "10.0.0.1"}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-sm font-medium">Port</h3>
                    <p className="text-sm">{connectionType === "ssh" ? "22" : "443"}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-sm font-medium">Connection Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {connectionType === "ssh"
                      ? "SSH access requires authentication. Your credentials will be used automatically."
                      : "Web console access will open in a new browser tab."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Button className="w-full" onClick={() => openInNewTab()}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  If the connection doesn't open automatically, click the button above.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            {!isConnected ? (
              <>
                <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={establishConnection} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)} className="w-full sm:w-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AWS Info Dialog */}
      <Dialog open={isAwsInfoDialogOpen} onOpenChange={setIsAwsInfoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              AWS Connection Instructions
            </DialogTitle>
            <DialogDescription>Follow these steps to connect to your AWS Remote Desktop</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium">Auto-Connect Script</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={copyScriptToClipboard}>
                  {scriptCopied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                  {scriptCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Copy and paste this script into your browser's console to automatically click the Connect button:
              </p>
              <div className="bg-slate-950 text-slate-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                {autoClickScript}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Wait for the AWS console to fully load</li>
                <li>Press F12 or right-click and select "Inspect" to open developer tools</li>
                <li>Click on the "Console" tab</li>
                <li>Paste the script above and press Enter</li>
                <li>
                  The script will find and click the Connect button with class{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    awsui_content_vjswe_lssc8_153 awsui_label_1f1d4_ocied_5
                  </code>
                </li>
              </ol>
            </div>

            <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-100 dark:border-amber-800">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-amber-500" />
                Important Note
              </h3>
              <p className="text-sm text-muted-foreground">
                Due to browser security restrictions, we cannot automatically click buttons on the AWS console page. The
                script above is a workaround that you need to manually execute in the browser console.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsAwsInfoDialogOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

