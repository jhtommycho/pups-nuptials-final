'use server'
import { prisma } from "@/lib/prisma";
import { getDbUserId, getUserByClerkId } from "./user.action";
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification.action";
import { marketingType, serviceStage, ServiceStatus } from "@prisma/client";


export async function createRequest(
  dogCount: number,
  marketing: marketingType,
  brideName: string,
  groomName: string,
  weddingDate: string,
  serviceLength: string,
  houseSitting: boolean,
  weddingCity: string,
  weddingAddress: string,
  houseSittingLocation: string,
  content: string,
  dogs: { dogName: string, dogAge: string, dogBreed: string, dogWeight?:string }[],
) {
  const userId = await getDbUserId();
  if (!userId) return;

  

  try {
    const create = await prisma.service.create({
      data: {
        userId,
        dogCount,
        marketing,
        brideName,
        groomName,
        weddingDate,
        serviceLength,
        houseSitting,
        weddingCity,
        weddingAddress,
        houseSittingLocation,
        content,
        Dog: {
          create: dogs.map(dog => ({
            userId,
            dogName: dog.dogName,
            dogAge: dog.dogAge,
            dogBreed: dog.dogBreed,
            dogWeight: dog.dogWeight
          }))
        }
      }
    });
    
    // Create notification for new request
    await createNotification(
      create.id,
      create.userId,
      'NEW_REQUEST',
      `New wedding service request from ${create.brideName} & ${create.groomName}`
    );
    
    revalidatePath("/")
    return create
  } catch (error) {
    console.log("Error while creating service request:", error);
  }
}

export async function getRequest(status?: ServiceStatus,location?:string) { 
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const inquiry = await prisma.service.findMany({
      where: {
        ...(status ? { status: status} : {}),
        ...(location ? { weddingCity: { contains: location, mode: "insensitive"}}: {}),
      },
      include: {
        Dog: true,
        user: true,
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    return inquiry;
}
catch (error){
  console.log(error)
}}

export async function getRequestByUserName(username: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const inquiry = await prisma.service.findMany({
      where: {
        user: {
          username: username
        }
      },
      include: {
        Dog: true,
        user: true,
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return inquiry;
  } catch (error) {
    console.log(error);
  }
}

export async function getRequestByUserID  () {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const inquiry = await prisma.service.findMany({
      where: {
        userId,
      },
      include: {
        Dog: true,
        user: true,
        Comment: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return inquiry;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(serviceId: string, content: string) {
  try {
    const userId = await getDbUserId()
    if (!userId) return

    const newComment = await prisma.comment.create({
      data: {
        userId,
        content,
        serviceId
      },
      include: {
        user: true,
        service: true
      }
    })
    
    // Create notification for new comment
    await createNotification(
      serviceId,
      userId,
      'NEW_COMMENT',
      `New comment from ${newComment.user.name || 'User'} on ${newComment.service.brideName} & ${newComment.service.groomName}'s request`
    );
    
    revalidatePath("/")
    return newComment

  } catch (error) {
    console.log(error)
  }
}

export async function getInquiryComments() {
  try {
    const userId = await getDbUserId()
    if (!userId) return

    const services = await prisma.service.findMany({
    include:{
      Comment: true,
      user: true,
      Dog: true,
    }})

    if (!services) throw new Error("No Inquiry from this user yet")

    const comments = await prisma.comment.findMany({
      where: {
        serviceId:  {
          in: services.map((service) => service.id)
        }
      },
      include: {
        user:true
      }
    })

    return comments
  } catch (error) {
    console.log(error)
  }
}

export async function updateRequest(serviceId: string, status: ServiceStatus) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const update = await prisma.service.update({
      where: {
        id: serviceId
      },
      data: {
        status
      }
    })

    revalidatePath("/")
    return update
  } catch (error) {
    console.log(error)
  }
}

export async function updateServiceStage(id:string, stage: serviceStage ) {
try {
  const userId = await getDbUserId()
  if (!userId) return
  const updateStatus = await prisma.service.update({
    where: {
      id
    },
    data:{
      stage
    }
  })
  revalidatePath("/")
  return updateStatus
} catch (error) {
  console.log(error)
  
}
}

export async function updateServiceDetails(id:string, dogCount?: number, weddingDate?: string, serviceLength?: string, houseSitting?: boolean, houseSittingLocation?:string, weddingCity?:string, weddingAddress?:string){
  try {
    const userId = await getDbUserId()
    if (!userId) return

    const update = await prisma.service.update({
      where: {id},
      data: {
        dogCount,
        weddingDate,
        serviceLength,
        houseSitting,
        houseSittingLocation,
        weddingCity,
        weddingAddress
      }
    })
    return update
  } catch (error) {
    
  }
}