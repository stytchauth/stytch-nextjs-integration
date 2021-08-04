// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as stytch from "stytch";
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
    const client = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
      env: stytch.envs.test,
    });
    // Process a POST request
    const { token } = req.query;
    try {
      const resp = await client.magicLinks.authenticate(token as string);
      // Set session
      req.session.set("user", {
        id: resp.user_id,
        admin: true,
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
  //res.status(200).json({ name: 'John Doe' })
}

export default withSession(handler);
