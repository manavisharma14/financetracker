import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
export async function GET(){
    // GET ALL transactions for logged in usser
    // get user from session
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({message: "User not autenticated"}, { status : 401 });
    }

    const userEmail = session.user?.email;
    const userId = session.user?.id;

    const transactions = await prisma.transaction.findMany({
        where: { userId : userId},
        orderBy: { createdAt : "desc" }
    })

    return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({message: "User not autenticated"}, { status : 401 });
    }

    const userEmail = session.user?.email;
    const userId = session.user?.id;
    
    const body = await request.json();
    const { amount, type, description } = body;
    if(!amount || !type){
        return NextResponse.json({message: "Amount and type are required"}, { status : 400 });
    }
    const transaction = await prisma.transaction.create({
        data: {
            amount, 
            type,
            description,
            userId: userId!
        }
    })
    return NextResponse.json(transaction);
}