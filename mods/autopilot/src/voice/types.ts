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
type GatherStream = {
  stop: () => Promise<void>;
  onData: (cb: (speech: string) => void) => void;
};

type Stream = {
  stop: () => Promise<void>;
  onData: (cb: (chunk: Uint8Array) => void) => void;
};

type Voice = {
  sessionRef: string;
  answer: () => Promise<void>;
  hangup: () => Promise<void>;
  say: (text: string) => Promise<void>;
  sgather: () => Promise<GatherStream>;
  stream: () => Promise<Stream>;
  stopSpeech: () => Promise<void>;
};

export { Voice };