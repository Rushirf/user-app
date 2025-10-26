"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Camera, Loader2 } from "lucide-react"
import clsx from "clsx"
import { showToast } from "@/lib/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Label } from "../ui/label"
import { registerUserApi } from "@/app/users/action"

// import ConfirmDialog from "./ConfirmDialog"
export type UserProfile = {
    id: string,
    name: string
    email: string
    phone: string
    gender?: string,
    avatarUrl?: string,
    status?: string
}

interface EditTrainerProfileProps {
    isOpen: boolean
    onClose: () => void


}

const AddUserModel: React.FC<EditTrainerProfileProps> = ({ isOpen, onClose }) => {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        avatarUrl: "",
        gender: "",
        age: "",
        city: "",
    })
    const queryClient = useQueryClient();
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [isConverting, setIsConverting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const UserProfileMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                name: profileData.name,
                email: profileData.email,
                phoneNumber: profileData.phone,
                password: "test123",
                age: profileData.age,
                city: profileData.city,
                gender: profileData.gender,
                profilePicture: profileImage || undefined, // assuming you want to send this
            };

            return registerUserApi(payload);
        },
        onSuccess: (res) => {

            if (res.success) {
                onClose()
                showToast({
                    tone: "success",
                    variant: "solid",
                    children: <p className="font-medium">Profile details saved successfully</p>,
                });
                queryClient.invalidateQueries({
                    queryKey: ["getUsersApi"],
                });

            } else {
                showToast({
                    tone: "error",
                    variant: "solid",
                    children: <p className="font-medium">{res.message}</p>,
                });

            }
        },

    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleGenderChange = (value: string) => {
        setProfileData((prev) => ({
            ...prev,
            gender: value,
        }))
    }

    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0]
    //   if (file) {
    //     setProfileImage(file)
    //     const reader = new FileReader()
    //     reader.onload = (e) => {
    //       setImagePreview(e.target?.result as string)
    //     }
    //     reader.readAsDataURL(file)
    //   }
    // }
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isHeic =
            file.name.toLowerCase().endsWith(".heic") ||
            file.name.toLowerCase().endsWith(".heif") ||
            file.type === "image/heic" ||
            file.type === "image/heif"

        let finalFile = file

        try {
            if (isHeic) {
                setIsConverting(true)
                // ⏳ Show loader here if needed
                const heic2any = (await import("heic2any")).default
                const blob = await heic2any({ blob: file, toType: "image/jpeg" })
                finalFile = new File([blob as BlobPart], file.name.replace(/\.heic$/i, ".jpg"), {
                    type: "image/jpeg",
                })
            }

            setProfileImage(finalFile)

            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(finalFile)
        } catch (err) {
            console.error("Image handling failed:", err)
            showToast({
                tone: "error",
                variant: "solid",
                children: <>Failed to process the image. Please try again.</>,
            })
        } finally {
            setIsConverting(false)
        }
    }

    const validate = () => {
        const newErrors: { [key: string]: string } = {}
        const { name, email, phone } = profileData

        if (!name.trim()) newErrors.name = "Name is required."
        if (!email.trim()) {
            newErrors.email = "Email is required."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email."
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required."
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Phone must be exactly 10 digits."
        }

        return newErrors
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitAttempted(true)

        const validationErrors = validate()
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) return
        UserProfileMutation.mutate()
        setConfirmOpen(false)
        setConfirmOpen(true)
    }
    console.log(profileData);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-lg w-full dark:border-gray-600 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-foreground">
                            Add profile details
                        </DialogTitle>

                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Image Upload */}
                        <div className="space-y-2">
                            <Label>Profile Image</Label>
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    {/* <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
                  <AvatarFallback>
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </AvatarFallback> */}
                                    {isConverting ? (
                                        // ✅ Loader inside Avatar
                                        <div className="flex items-center justify-center w-full h-full bg-muted">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <>
                                            <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
                                            <AvatarFallback>
                                                <Camera className="w-6 h-6 text-muted-foreground" />
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="w-4 h-4" />
                                        {imagePreview ? " Change Image" : " Upload Image"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className={clsx(errors.name && submitAttempted && "border-red-500")}
                                required
                            />
                            {errors.name && submitAttempted && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"

                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={clsx(errors.email && submitAttempted && "border-red-500 !cursor-not-allowed")}
                                required
                            />
                            {errors.email && submitAttempted && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"

                                name="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (/^\d*$/.test(value) && value.length <= 10) {
                                        setProfileData((prev) => ({ ...prev, phone: value }))
                                    }
                                }}
                                placeholder="Enter your phone number"
                                className={clsx(errors.phone && submitAttempted && "border-red-500")}
                                required
                            />
                            {errors.phone && submitAttempted && (
                                <p className="text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="age">age</Label>
                            <Input
                                id="age"
                                name="age"
                                value={profileData.age}
                                onChange={handleInputChange}
                                placeholder="Enter your age"
                                className={clsx(errors.age && submitAttempted && "border-red-500")}
                                required
                            />
                            {errors.age && submitAttempted && (
                                <p className="text-sm text-red-500">{errors.age}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={profileData.city}
                                onChange={handleInputChange}
                                placeholder="Enter your city"
                                className={clsx(errors.city && submitAttempted && "border-red-500")}
                                required
                            />
                            {errors.city && submitAttempted && (
                                <p className="text-sm text-red-500">{errors.city}</p>
                            )}
                        </div>
                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={profileData.gender}
                                onValueChange={handleGenderChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-red-500 hover:text-red-500 hover:bg-red-200"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit"
                                disabled={UserProfileMutation.isPending}>
                                {UserProfileMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default AddUserModel;
