// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import withSession from "../withSession";
type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  error: string;
};

export async function handler(
  req: NextIronRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      // Set session
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
}

export default withSession(handler);
