import getConfig from "next/config";

export default function TestComponents() {
  const { publicRuntimeConfig } = getConfig();
  console.log(
    "🚀 ~ TestComponents ~ publicRuntimeConfig:",
    publicRuntimeConfig
  );
  const clientId = publicRuntimeConfig.launchDarklyClientId;
  console.log("🚀 ~ clientId:", clientId);

  return (
    <h2 className="text-center text-3xl text-red-800">
      This is the client {clientId} from .env file
    </h2>
  );
}
