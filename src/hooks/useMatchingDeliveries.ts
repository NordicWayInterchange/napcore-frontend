import { useQuery } from "@tanstack/react-query";
import { ExtendedCapability } from "@/types/capability";
import { ExtendedDelivery } from "@/types/delivery";

const fetchMatchingDeliveries: (
  commonName: string,
  selector: string
) => Promise<ExtendedDelivery[]> = async (commonName, selector) => {
  const res = await fetch(
    `/api/${commonName}/deliveries/capabilities?selector=${selector}`
  );

  if (res.ok) {
    const capabilities: ExtendedDelivery[] = await res.json();
    return capabilities;
  } else {
    const errorObj = await res.json();
    throw new Error(`${errorObj.errorCode}: ${errorObj.message}`);
  }
};

const useMatchingDeliveries = (commonName: string, selector: string) => {
  return useQuery({
    queryKey: ["matchingDeliveries"],
    queryFn: () => fetchMatchingDeliveries(commonName, selector),
  });
};

export { useMatchingDeliveries };
