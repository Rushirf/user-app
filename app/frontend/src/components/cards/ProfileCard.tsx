"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, User, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"



export type UserProfile = {
  id: string,
  name: string
  email: string
  phone: string
  gender?: string,
  avatarUrl?: string,
  status?: string
}

type ProfileCardProps = {
  user: UserProfile
  showEditButton?: boolean
  onEditClick?: () => void
}

const ProfileCard = ({
  user,
  showEditButton = true,
  onEditClick,
}: ProfileCardProps) => {
  return (
    <Card className="shadow-xl border border-border dark:border-gray-600 dark:bg-gray-800 gap-3 pt-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-foreground p-0 text-center md:text-left">
          Personal Details
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-4 lg:gap-8 items-center md:items-start">
        {/* Avatar */}
        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 border border-muted shadow-md">
          <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>

        {/* Info + Edit Button */}
        <div className="flex flex-col w-full gap-6">
          {/* Name + details */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-semibold">{user.name}</h3>

            <div className="flex flex-col lg:items-center  sm:flex-row sm:flex-wrap gap-4 sm:gap-8 text-sm sm:text-base text-muted-foreground justify-start">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="text-brand-500 p-1.5 w-8 h-8 sm:w-10 sm:h-10 bg-primary/25 dark:bg-primary/10 rounded-md" />
                <p className="text-foreground font-medium text-base sm:text-lg break-all">{user.email}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="text-brand-500 p-1.5 w-8 h-8 sm:w-9 sm:h-9 bg-primary/25 dark:bg-primary/10 rounded-md" />
                <p className="text-foreground font-medium text-base sm:text-lg">{user.phone}</p>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-3">
                <User className="text-brand-500 p-1.5 w-8 h-8 sm:w-9 sm:h-9 bg-primary/25 dark:bg-primary/10 rounded-md" />
                <p className="text-foreground font-medium text-base sm:text-lg capitalize">
                  {user.gender}
                </p>
              </div>



            </div>
          </div>

          {/* Edit Button */}
          {/* {showEditButton && (
            <div className="flex justify-center md:justify-end">
              <Button onClick={onEditClick} className="gap-2 w-full sm:w-auto">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>

  )
}

export default ProfileCard
