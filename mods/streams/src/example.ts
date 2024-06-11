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
import { AudioSocket } from "./AudioSocket";
import { AudioStream } from "./AudioStream";
import { StreamRequest } from "./types";

const logger = getLogger({ service: "streams", filePath: __filename });

const PORT = 9092;

const audioSocket = new AudioSocket();

async function connectionHandler(req: StreamRequest, stream: AudioStream) {
  const { ref } = req;
  logger.verbose("new connection", { ref });

  stream.onData((data) => {
    // Do something with the data
  });

  stream.onClose(() => {
    logger.verbose("stream closed");
  });

  stream.onError((err) => {
    logger.error("tream error", err);
  });

  const filePath = process.cwd() + "/etc/sounds/test.sln";

  logger.verbose("playing sound", { filePath });

  await stream.play(filePath);

  // Hangup the stream after 10 seconds
  setTimeout(async () => {
    logger.verbose("hangin up the stream", { ref });
    stream.hangup();
  }, 10000);
}

audioSocket.listen(PORT, "192.168.1.7", () => {
  logger.info(`audiosocket listening on port ${PORT}`);
});

audioSocket.onConnection(connectionHandler);