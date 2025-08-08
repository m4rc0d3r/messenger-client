import { z } from "zod";

const zServerAppConfig = z
  .object({
    VITE_HTTP_SERVER_URL: z.string().url(),
    VITE_WEB_SOCKET_SERVER_URL: z.string().url(),
  })
  .transform(({ VITE_HTTP_SERVER_URL, VITE_WEB_SOCKET_SERVER_URL }) => ({
    httpUrl: VITE_HTTP_SERVER_URL,
    websocketUrl: VITE_WEB_SOCKET_SERVER_URL,
  }));
type ServerAppConfig = z.infer<typeof zServerAppConfig>;

export { zServerAppConfig };
export type { ServerAppConfig };
