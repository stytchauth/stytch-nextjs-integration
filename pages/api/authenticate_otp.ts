// This API route authenticates Stytch OTP codes.
import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import withSession from "../../lib/withSession";
import loadStytch from "../../lib/loadStytch";
type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  msg: string;
};

export async function handler(
  req: NextIronRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      // params are of type stytch.LoginOrCreateUserBySMSRequest
      const params = {
        code: data.otpInput,
        method_id: data.methodId,
      };

      const resp = await client.otps.authenticate(params);
      if (resp.status_code.toString() === "200") {
        req.session.set("user", {
          id: resp.user_id,
        });
        await req.session.save();
        res
          .status(200)
          .send({ msg: `successfully authenticated ${resp.user_id}` });
      } else {
        throw Error("Error authenticating your code");
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error });
    }
  } else {
    // Handle any other HTTP method
  }
}

export default withSession(handler);
