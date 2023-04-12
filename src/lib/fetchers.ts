const napCoreBaseUrl = process.env.NEXT_PUBLIC_NAPCORE_API_URI;

export const getSubscriptions = (userName: string) => {
  return fetch(`${napCoreBaseUrl}/${userName}/subscriptions`);
};

export const getNetworkCapabilities = (
  userName: string,
  selector: string = ""
) => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/network/capabilities?selector=${selector}`
  );
};

export const getCapabilities = (userName: string, selector: string = "") => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`
  );
};

export const getDeliveries = (userName: string, selector: string = "") => {
  return fetch(
    `${napCoreBaseUrl}/${userName}/capabilities?selector=${selector}`
  );
};
