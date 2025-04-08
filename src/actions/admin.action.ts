"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId, getUser } from "./user.action";
import { revalidatePath } from "next/cache";


export async function getHeroSection() {
  try {
    const user = await getUser()
    if (user?.userRole !== 'manager') return
    const heroSection = await prisma.header.findMany({
      orderBy: {
        id: "desc"
      }
    })
    return heroSection
  } catch (error) {
  }
}

export async function getDiscoverySection() {
  const user = await getUser()
  if (user?.userRole !== 'manager') return
  const DisoverySection = await prisma.discovery.findMany({
    orderBy: {
      id: "desc"
    }
  })
  return DisoverySection
}

export async function getFeatureSection(){
  const user = await getUser()
  if (user?.userRole !== 'manager') return

  const featureSection = await prisma.feature.findMany({
    orderBy: {
      id: "desc"
    }
  })

  return featureSection
}

export async function updateHeroSection (id: string, title?:string, image?:string) {

  try {
    const user = await getUser()
    if (user?.userRole !== "manager") return
    console.log("cleared manager")
  
    const updateHero = await prisma.header.update({
      where: {id},
      data: {
        title,
        image
      }
    })
    revalidatePath('/')
    return updateHero
    
  } catch (error) {
    console.log(error)
  }
    
}

export async function updateDiscoverySection (id: string, year?: string, title?:string, description?: string, achievement?:string, image?:string ) {
  try {
    const user = await getUser()
    if (user?.userRole !== 'manager') return

    const updateDiscovery = await prisma.discovery.update({
      where: {id},
      data: {
        year,
        title,
        description,
        achievement,
        image
      }
    })
    revalidatePath("/")
    return updateDiscovery
  } catch (error) {
    console.log(error)
  }
}

export async function updateFeatureSection (id:string, title?:string, description?:string, image?:string) {
  try {
    const user = await getUser()
    if (user?.userRole !== 'manager') return

    const updateFeature = await prisma.feature.update({
      where: {id},
      data: {
        title,
        description,
        image
      }
    })
    return updateFeature
  } catch (error) {
    
  }
}

export async function updateTestimonialSection (id: string, client?:string, description?:string, image?:string) {

  try {
    const user = await getUser()
    if (user?.userRole !== "manager") return
    console.log("cleared manager")
  
    const updateTest = await prisma.testimonials.update({
      where: {id},
      data: {
        client,
        description,
        image
      }
    })
    revalidatePath('/')
    return updateTest
    
  } catch (error) {
    console.log(error)
  }
    
}

export async function createTestimonial (client:string, description:string, image:string) {

  try {
    const user = await getUser()
    if (user?.userRole !== "manager") return
    console.log("cleared manager")
  
    const createTest = await prisma.testimonials.create({
      
      data: {
        client,
        description,
        image
      }
    })
    revalidatePath('/')
    return createTest
    
  } catch (error) {
    console.log(error)
  }
}

export async function createPackage (title: string, description:string, price:number, favorite:boolean, packageFeatures: {content: string}[]) {
  try {
    const user = await getUser()
    if (user?.userRole !== "manager") return
    
    const createPackage = await prisma.package.create({
      data: {
        title,
        description,
        price,
        favorite,
        PackageFeatures: {
          create: packageFeatures.map(f => ({
            content: f.content
          }))
        }
      }
    })

    revalidatePath("/")
    return createPackage
  } catch (error) {
    console.log(error)
  }
}

export async function getPackages () {
  try {
    const packages = await prisma.package.findMany({
      orderBy: {
        price:"asc"
      },
      include: {
        PackageFeatures:true
      }
    })
    return packages
  } catch (error) {
    
  }
}

export async function updatePackages(id:string,title?:string, description?:string, price?:number, favorite?:boolean, packageFeatures?:{id?: string, content?:string}[]) {
try {

  await prisma.package.update({
  where: {id},
  data: {
    title,
    description,
    price,
    favorite,
   PackageFeatures: {
  updateMany: packageFeatures
    ?.filter(f => f.id)
    .map((f) => ({
      where: { id: f.id },
      data: { content: f.content },
    })),
  }
  }
})
// Update to add and remove features

revalidatePath("/")


} catch (error) {
  console.log(error)
}

}

