import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params } : { params: Promise<{ id : string }>}){
    const { id } = await params;
    if(!id){
        return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
    }

    await prisma.transaction.delete({
        where: { id }
    });
    return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
}