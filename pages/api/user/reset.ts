import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { hash } from "bcrypt";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const prisma = new PrismaClient({ log: ["query"] });

  try {
    const userData = req.body;
    const userRole =
      userData.email === "findalwilliams@gmail.com" ||
      userData.email === "andy@nonissue.org"
        ? "ADMIN"
        : "USER";

    hash(userData.password, 10, async function (err, hash) {
      if (!err) {
        const user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hash,
            role: userRole,
          },
        });

        res.status(201);
        res.json({ user });
      } else {
        res.status(500);
      }
    });
  } catch (error) {
    res.status(500);
    res.json({ error });
  } finally {
    await prisma.$disconnect();
  }
}
