import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
    const id = parseInt(params.id);
    await prisma.playerRequest.delete({ where: { id } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
