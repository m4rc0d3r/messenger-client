import { z } from "zod";

const zServerAppConfig = z
  .object({
    VITE_HTTP_SERVER_URL: z.string().url(),
    VITE_WEB_SOCKET_SERVER_URL: z.string().url(),
    VITE_SERVER_DEPLOYMENT_PLATFORM: z.enum(["LOCAL", "RENDER"]),
  })
  .transform(
    ({
      VITE_HTTP_SERVER_URL,
      VITE_WEB_SOCKET_SERVER_URL,
      VITE_SERVER_DEPLOYMENT_PLATFORM,
    }) => ({
      httpUrl: VITE_HTTP_SERVER_URL,
      websocketUrl: VITE_WEB_SOCKET_SERVER_URL,
      deploymentPlatform: VITE_SERVER_DEPLOYMENT_PLATFORM,
    }),
  );
type ServerAppConfig = z.infer<typeof zServerAppConfig>;

export { zServerAppConfig };
export type { ServerAppConfig };
