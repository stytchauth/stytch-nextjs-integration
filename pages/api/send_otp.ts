// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../loadStytch";

type Data = {
  methodId: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      const phoneNumber = data.phoneNumber.replace(/\D/g, "");

      // params are of type stytch.LoginOrCreateUserBySMSRequest
      const params = {
        phone_number: `${data.intlCode}${phoneNumber}`,
      };

      const resp = await client.otps.sms.loginOrCreate(params);
      res.status(200).json({ methodId: resp.phone_id });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  } else {
    // Handle any other HTTP method
  }
}

export default handler;
