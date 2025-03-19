"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VirtualMachinesCatalog } from "./virtual-machines-catalog"
import { VirtualMachinesMyResources } from "./virtual-machines-my-resources"
import { VirtualMachinesUsage } from "./virtual-machines-usage"

export function VirtualMachinesContent() {
  const [activeTab, setActiveTab] = useState("catalog")

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="container py-4">
          <h1 className="text-3xl font-bold">Virtual Machines</h1>
          <p className="text-muted-foreground mt-1">
            Rent virtual machines, GPUs, and compute resources for your projects
          </p>
        </div>
      </div>
      <div className="container py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="my-resources">My Resources</TabsTrigger>
            <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog" className="flex-1">
            <VirtualMachinesCatalog />
          </TabsContent>
          <TabsContent value="my-resources" className="flex-1">
            <VirtualMachinesMyResources />
          </TabsContent>
          <TabsContent value="usage" className="flex-1">
            <VirtualMachinesUsage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

