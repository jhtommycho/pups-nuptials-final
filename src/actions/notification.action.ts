'use server'

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createNotification(
  serviceId: string,
  userId: string,
  type: 'NEW_REQUEST' | 'NEW_COMMENT',
  content: string
) {
  try {

    const userIds = await getDbUserId();
    if (!userIds) return;


    const notification = await prisma.notification.create({
      data: {
        serviceId,
        userId,
        type,
        content,
        read: false
      }
    });
    
    revalidatePath("/");
    return notification;
  } catch (error) {
    console.log("Error creating notification:", error);
  }
}

export async function getUnreadNotificationsManager() {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Only fetch notifications for managers
    if (user?.userRole !== 'MANAGER') return;
    
    const notifications = await prisma.notification.findMany({
      where: {
        read: false
      },
      include: {
        service: {
          include: {
            user: true
          }
        },
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return notifications;
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        read: true
      }
    });
    
    revalidatePath("/");
  } catch (error) {
    console.log("Error marking notification as read:", error);
  }
}

export async function markAllNotificationsAsRead() {
  try {
    await prisma.notification.updateMany({
      where: {
        read: false
      },
      data: {
        read: true
      }
    });
    
    revalidatePath("/");
  } catch (error) {
    console.log("Error marking all notifications as read:", error);
  }
} 

export async function getAllNotifications() {
try {
  const userId = await getDbUserId();
  if (!userId) return;
  
  const notifications = await prisma.notification.findMany({
   include: { 
        service: {
          include: {
            user: true,
            Comment: {
              include: {
                user: true
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1 // Get the latest comment
            }
          }
        },
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
  })
  return notifications
} catch (error) {
  console.log("Error fetching all notifications:", error);
}
}
