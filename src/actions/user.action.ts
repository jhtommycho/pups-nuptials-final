'use server'

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { Prisma, User } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function syncUser(): Promise<User | undefined> {
  try {
    const { userId } = await auth(); // check if userId is in auth - clerk
    const user = await currentUser(); // pull all user info.

    if (!userId || !user) return;

    // check if user

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    // if user doesnt exist create
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        // if there is no username, then the prefix of email before @ will default to username
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in SyncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("user not found");

  return user.id;
}

export async function getUser(){
  try {
    const userId = await getDbUserId();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      
    });

    return user;
  } catch (error) {
    console.log("Error in getUser", error);
}}