'use client'

import { IUserCardProps } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../ui"

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  personType,
}: IUserCardProps) => {
  const router = useRouter()
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image 
          src={imgUrl}
          alt={`${name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
        Voir
      </Button>
    </article>
  )
}

export default UserCard