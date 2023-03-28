// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SubscriptionStatus, Subscriptions } from "../../types/subscription";

const mockSubscriptions: Subscriptions = {
  name: "henrik",
  version: 1,
  subscriptions: [
    {
      id: "foo",
      path: "/foo/bar",
      selector: "*",
      consumerCommonName: "rolf",
      lastUpdatedTimeStamp: 123456789,
      status: SubscriptionStatus.CREATED,
    },
    {
      id: "bar",
      path: "/bar/foo",
      selector: "*",
      consumerCommonName: "johnny",
      lastUpdatedTimeStamp: 123456789,
      status: SubscriptionStatus.REQUESTED,
    },
  ],
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Subscriptions>
) {
  res.status(200).json(mockSubscriptions);
}
