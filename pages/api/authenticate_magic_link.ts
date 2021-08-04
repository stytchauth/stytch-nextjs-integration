// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import withSession from "../withSession";
import loadStytch from "../loadStytch";
type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  error: string;
};

export async function handler(
  req: NextIronRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const client = loadStytch();
    const { token } = req.query;
    try {
      const resp = await client.magicLinks.authenticate(token as string);
      // Set session
      req.session.set("user", {
        id: resp.user_id,
      });
      await req.session.save();
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
}

export default withSession(handler);
