"use client"
import React from "react"
import { useModal } from "@/hooks/useModal"


import PageHeader from "@/components/common/PageHeader"
import { useQuery } from "@tanstack/react-query"
import { getUserDetailsApi } from "../../action"
import ProfileCard from "@/components/cards/ProfileCard"

export type UserProfile = {
  id: string,
  name: string
  email: string
  phone: string
  gender?: string,
  avatarUrl?: string,
  status?: string
}

const UserProfile = ({ id }: { id: string }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    data: userProfile,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["getUserDetails", id],
    queryFn: () => getUserDetailsApi(id),
    enabled: true,
  });
console.log(userProfile);

  const UserProfiledata: UserProfile = {
    id: userProfile?._id || "",
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phoneNumber || "",
    gender: userProfile?.gender || "",
    avatarUrl: userProfile?.profilePicture || "",


  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <PageHeader title=" User Profile" />
          {/* <PageBreadcrumb pageTitle="Profile" /> */}
        </div>
        {isFetching ? (
          <div className="flex justify-center items-center h-[70vh]">
            Loading...
          </div>
        ) : (
          <>
            <ProfileCard
              user={UserProfiledata}
              showEditButton={true}
              onEditClick={openModal}
            />

          </>
        )}

      </section>

    </>
  )
}

export default UserProfile
