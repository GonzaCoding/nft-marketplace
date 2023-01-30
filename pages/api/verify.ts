import { v4 as uuidv4 } from "uuid";
import { Session } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "./utils";
import { contractAddress } from "./utils";

export default withSession(async (request: NextApiRequest & { session: Session }, response: NextApiResponse) => {
  if (request.method === "GET") {
    try {
      const message = {
        contractAddress,
        id: uuidv4(),
      }
      
      request.session.set("message-session", message);
      await request.session.save();
      response.json(message);

    } catch (error) {
      response.status(422).send({ message: "Cannot generate a message!"});
    }
  } else {
    response.status(200).json({ message: "Invalid api route"});
  } 
});
