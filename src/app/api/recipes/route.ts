import Recipe from "../../models/Recipe";
import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";
import connectMongoDB from "../../../utils/mongoose";

const prisma = new PrismaClient();
// run inside `async` function

export const GET = async function (req: NextRequest) {
  if (req.method == "GET") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = token.sub;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user)
        return new NextResponse(JSON.stringify(user.recipes), { status: 200 });
    } catch (error) {
      return new NextResponse(
        "Error in fetching RECIPES in recipes/route.ts: " + error,
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
};

export const PATCH = async function (req: NextRequest) {
  if (req.method === "PATCH") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = token.sub;
    const body = await req.json();
    const newRecipe = body?.newRecipe;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          recipes: {
            push: newRecipe,
          },
        },
      });

      console.log("UPDATED USER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!, ", updatedUser);
      if (updatedUser)
        return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
      return new NextResponse(
        "Error in updating RECIPES in recipes/route.ts: " + error,
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
};

// const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
// if (!token) {
//   return new NextResponse("Unauthorized", { status: 401 });
// }
// // Use token for your logic
// console.log("TOKEN???????????????????????????????", token);
//   try {

//     const body = await req.json();
//     const userEmail = body.userEmail;
//     const recipe = body.recipeObj;

//     console.log("EAMIL!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@#############$$$$$$$$$$$$$%%%%%%%%% 1", userEmail);
//     console.log("RECIPE!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@#############$$$$$$$$$$$$$%%%%%%%%% 2", recipe);
//     await connectMongoDB();
//     const addRecipeToUser = await User.findOneAndUpdate(
//       { email: userEmail },
//       { $push: { recipes: recipe } }
//     );
//     console.log("addRecipeToUser", addRecipeToUser);
//     if (addRecipeToUser)
//       return new NextResponse(JSON.stringify(addRecipeToUser), { status: 200 });
//   }
//     catch (error) {
//     return new NextResponse(
//       "Error in fetching RECIPES in recipes/route.ts: " + error,
//       { status: 500 }
//     );
//   }
// }
