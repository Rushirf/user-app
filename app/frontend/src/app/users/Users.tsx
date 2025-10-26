"use client"
import PageHeader from '@/components/common/PageHeader'
import AddUserModel from '@/components/models/AddUserModel'
import { UserTable } from '@/components/tables/UserTable'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const Users = () => {
       const { isOpen, openModal, closeModal } = useModal();
  return (
     <>
            <section className="">
                <div className="flex flex-row mb-4 justify-between gap-2 sm:gap-3 items-center">
                    <PageHeader title="All Users" />

                    <Button className="h-8 sm:h-10 sm:px-5 text-xs sm:text-base shadow-sm"
                     onClick={openModal}
                     >
                        <FaPlus className="" />
                        Add User
                    </Button>
                </div>

        
                <UserTable />

            </section>
       <AddUserModel isOpen={isOpen} onClose={closeModal} />
        </>
  )
}

export default Users
