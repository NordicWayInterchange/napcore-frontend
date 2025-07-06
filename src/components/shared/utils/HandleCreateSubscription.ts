import { IFeedback } from "@/interface/IFeedback";
import { createSubscription } from "@/lib/fetchers/internalFetchers";

export async function HandleCreateSubscription(
  name: string,
  bodyData: {
    selector: string;
    description: string;
  },
  setFeedback: (
    value: ((prevState: IFeedback) => IFeedback) | IFeedback
  ) => void
) {

  const response = await createSubscription(name, bodyData);

  if (response.ok) {
    setFeedback({
      feedback: true,
      message: "Subscription successfully created",
      severity: "success",
    });
  } else {
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Subscription could not be created, try again!";

    setFeedback({
      feedback: true,
      message: errorMessage,
      severity: "warning",
    });
  }
}
