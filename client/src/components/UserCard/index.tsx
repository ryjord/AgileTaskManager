// import
import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

// props type for the UserCard component
type Props = {
  user: User;
};

// UserCard component
const UserCard = ({ user }: Props) => {
    // Render the user card with profile picture, username, and email
    return (
        <div className="flex items-center rounded border p-4 shadow">
            <Image
                src={user.profilePictureUrl ? "/" + user.profilePictureUrl.replace(/^public\//, "") : "/default.jpg"}
                alt="profile picture"
                width={32}
                height={32}
                className="rounded-full"
            />
            <div className="ml-4">
                <p>
                  <span className="text-red-600 dark:text-red-400">Username:</span>
                  <span className="ml-1 text-black dark:text-white">{user.username || 'Unknown User'}</span>
                </p>
                <p>
                  <span className="text-red-600 dark:text-red-400">Email:</span>
                  <span className="ml-1 text-black dark:text-white">{user.email || 'No email provided'}</span>
                </p>
            </div>
        </div>
    );
};

export default UserCard;