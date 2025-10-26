import React from "react"
import { notFound } from "next/navigation"
import UserProfile from "./UserProfile"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params

  if (!id) return notFound()

  return <UserProfile id={id} />
}

export default Page