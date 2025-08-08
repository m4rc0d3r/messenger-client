import { either } from "fp-ts";
import { z } from "zod";

import { zServerAppConfig } from "./server-app";

const zNodeEnv = z.enum(["dev", "prod"]);
const NodeEnv = zNodeEnv.enum;
type NodeEnv = z.infer<typeof zNodeEnv>;

const zConfig = z
  .object({
    NODE_ENV: zNodeEnv,
    serverApp: zServerAppConfig,
  })
  .transform(({ NODE_ENV, ...rest }) => ({
    nodeEnv: NODE_ENV,
    ...rest,
  }));
type Config = z.infer<typeof zConfig>;

function createConfig(
  variables: Record<string, unknown> & { NODE_ENV?: string | undefined },
): either.Either<Error, Config> {
  return either.tryCatch(
    () =>
      zConfig.parse({
        ...Object.fromEntries(
          Object.keys(zConfig.innerType().keyof().Enum).map((key) => [
            key,
            variables,
          ]),
        ),
        NODE_ENV: variables.NODE_ENV,
      }),
    (error: unknown) => {
      if (error instanceof z.ZodError) {
        return new Error(
          `Failed to create application configuration. Issues: ${JSON.stringify(
            error.issues,
            null,
            2,
          )}`,
        );
      }
      throw error;
    },
  );
}

export { createConfig, NodeEnv, zConfig, zNodeEnv };
export type { Config };
