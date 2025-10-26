"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import React from "react"

type PageHeaderProps = {
  title: string
  showBack?: boolean // defaults to true
}

export default function PageHeader({ title, showBack = true }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-2 sm:gap-4">
        {showBack && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => router.back()}
           
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-brand-400 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
    </div>
  )
}
