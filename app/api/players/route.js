import prisma from "../../lib/prisma"
import { NextResponse } from 'next/server'

const heroImages = {
    ardeos: "/ardeos.webp",
    elarion: "/elarion.webp",
    helena: "/helena.jpg",
    mara: "/mara.jpg",
    meiko: "/meiko.webp",
    rime: "/rime.webp",
    sylvie: "/sylvie.webp",
    tariq: "/tariq.webp",
    vigour: "/vigour.jpg",
};

const heroRoles = {
    ardeos: "DPS",
    elarion: "DPS",
    helena: "TANK",
    mara: "DPS",
    meiko: "TANK",
    rime: "DPS",
    sylvie: "HEAL",
    tariq: "DPS",
    vigour: "HEAL",
};




export async function POST(req) {
    try {
        const data = await req.json()

        const hero = String(data.hero).trim();
        const localisation = String(data.localisation).trim();
        const imageHero = heroImages[data.hero] ?? null
        const itemLevel = Number(data.itemLevel);
        const highestKey = Number(data.highestKey);
        const keyResearched = Number(data.keyResearched);
        const rating = Number(data.rating);
        const invitationLink = String(data.invitationLink).trim();


        if (isNaN(itemLevel)) {
            throw new Error("Item level must be a number");
        }
        if (isNaN(highestKey)) {
            throw new Error("highestKey must be a number");
        }
        if (isNaN(keyResearched)) {
            throw new Error("Key researched must be a number");
        }
        if (isNaN(rating)) {
            throw new Error("Rating must be a number");
        }

        // Nombres
        if (itemLevel < 0 || itemLevel > 330) {
            throw new Error("Item level must be between 0 and 330");
        }

        if (highestKey < 0 || highestKey > 100 || keyResearched < 0 || keyResearched > 100) {
            throw new Error("Key values must be between 0 and 100");
        }

        if (rating < 0 || rating > 20000) {
            throw new Error("Rating must be between 0 and 20000");
        }

        // Strings
        if (hero.length === 0 || hero.length > 7) {
            throw new Error("Hero name length must be between 1 and 7");
        }

        // Localisation
        const allowedLoc = ["NA", "EU", "ASIA"]; // correspond aux options de ton select
        if (!allowedLoc.includes(localisation)) {
            throw new Error("Invalid localisation");
        }


        const linkRegex = /^FELLOWSHIP-[A-Z0-9]{26}$/;
        if (!linkRegex.test(invitationLink)) {
            throw new Error("Invitation link invalid");
        }

        // Vérifier si une annonce existe déjà pour ce lien et est encore active
        const now = new Date();
        const existing = await prisma.playerRequest.findFirst({
            where: {
                invitationLink,
                lastHeartbeat: {
                    gte: new Date(now.getTime() - 20_000) // 120 sec d’activité, adapte selon durée réelle
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "You already have an active announcement" },
                { status: 400 }
            );
        }




        const player = await prisma.playerRequest.create({
            data: {
                hero: data.hero,
                imageHero: imageHero, // auto-ajout
                role: heroRoles[data.hero], // auto-ajout
                itemLevel,
                highestKey,
                keyResearched,
                localisation: data.localisation,
                rating,
                invitationLink: data.invitationLink,
                lastHeartbeat: new Date(),
            },
        })

        return NextResponse.json(player, { status: 201 })
    } catch (error) {
        console.error('Error creating player:', error)
        return NextResponse.json(
            { error: 'Failed to create player', details: error.message },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const now = new Date()
        const thirtySecondsAgo = new Date(now.getTime() - 120_000)

        const players = await prisma.playerRequest.findMany({
            where: {
                lastHeartbeat: {
                    gte: thirtySecondsAgo,
                },
            },
        })

        return NextResponse.json(players, { status: 200 })
    } catch (error) {
        console.error('Error fetching players:', error)
        return NextResponse.json(
            { error: 'Failed to fetch players', details: error.message },
            { status: 500 }
        )
    }
}