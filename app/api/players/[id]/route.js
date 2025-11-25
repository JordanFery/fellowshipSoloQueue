import { prisma } from "@/lib/prisma";

export async function PATCH(req, { params }) {
    const id = parseInt(params.id);
    const updated = await prisma.playerRequest.update({
        where: { id },
        data: { lastHeartbeat: new Date() },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
}
