/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { getLogger } from "@fonoster/logger";
import { z } from "zod";
import { Prisma } from "../../db";
import { GRPCErrors, handleError } from "../../errors";

const logger = getLogger({ service: "apiserver", filePath: __filename });

const DeleteAPIKeyRequestSchema = z.object({
  id: z.string()
});

type DeleteAPIKeyRequest = z.infer<typeof DeleteAPIKeyRequestSchema>;

type DeleteAPIKeyResponse = {
  id: string;
};

function deleteAPIKey(prisma: Prisma) {
  return async (
    call: { request: DeleteAPIKeyRequest },
    callback: (error: GRPCErrors, response?: DeleteAPIKeyResponse) => void
  ) => {
    try {
      const validatedRequest = DeleteAPIKeyRequestSchema.parse(call.request);

      const { id } = validatedRequest;

      logger.info("deleting API Key", { id });

      const response = await prisma.aPIKey.delete({
        where: {
          id
        }
      });

      callback(null, {
        id: response.id
      });
    } catch (error) {
      handleError(error, callback);
    }
  };
}

export { deleteAPIKey };