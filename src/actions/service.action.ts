'use server'
import { prisma } from "@/lib/prisma";
import { getDbUserId, getUserByClerkId } from "./user.action";
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification.action";
import { marketingType, serviceStage, ServiceStatus, userRoleType } from "@prisma/client";


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
  servicePackage?: string,
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
        },
        servicePackage,
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

export async function getRequest(status?: ServiceStatus,location?:string, role?:userRoleType) { 
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
          take: 1
        },
      },
    });
    
    

  const filteredInquiries = inquiry.filter(service => {
      if (service.Comment.length > 0) {
        const lastComment = service.Comment[0];
        // Check if a role filter is provided and if the last comment's user role matches the specified role
        return role ? lastComment.user.userRole === role : true;
      }
      // If there's no comment, include the service if no role filter is set
      return role ? false : true;
    });
    
    return filteredInquiries
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
    revalidatePath('/')
    return update
  } catch (error) {
    
  }
}

export async function getFeature(){
  return await prisma.feature.findMany({
  })

}

export async function getTestimonials(){
  return await prisma.testimonials.findMany({
    orderBy: {
      id: "desc"
    }
  })
  
}
