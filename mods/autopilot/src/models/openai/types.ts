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
import { KnowledgeBase } from "../../knowledge";
import { Tool } from "../../tools";

enum OpenAIModel {
  GPT_3 = "gpt-3",
  GPT_4 = "gpt-4",
  GPT_4O_MINI = "gpt-4o-mini"
}

type OpenAIParams = {
  model: OpenAIModel;
  apiKey: string;
  maxTokens: number;
  temperature: number;
  systemTemplate: string;
  knowledgeBase: KnowledgeBase;
  tools: Tool[];
};

export { OpenAIParams, OpenAIModel };