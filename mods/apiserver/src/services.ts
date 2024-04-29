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
import { prisma } from "./db";
import {
  IDENTITY_ACCESS_TOKEN_EXPIRES_IN,
  IDENTITY_AUDIENCE,
  IDENTITY_ID_TOKEN_EXPIRES_IN,
  IDENTITY_ISSUER,
  IDENTITY_PRIVATE_KEY,
  IDENTITY_PUBLIC_KEY,
  IDENTITY_REFRESH_TOKEN_EXPIRES_IN
} from "./envs";
import {
  createAPIKey,
  createGroup,
  createUser,
  deleteAPIKey,
  deleteGroup,
  deleteUser,
  exchangeCredentials,
  getGroupById,
  getUserById,
  inviteUserToGroup,
  listAPIKeys,
  listGroups,
  refreshToken,
  regenerateAPIKey,
  removeUserFromGroup,
  resendGroupMembershipInvitation,
  sendInvite,
  updateGroup,
  updateUser
} from "./identity";

const identityConfig = {
  issuer: IDENTITY_ISSUER,
  audience: IDENTITY_AUDIENCE,
  privateKey: IDENTITY_PRIVATE_KEY,
  publicKey: IDENTITY_PUBLIC_KEY,
  accessTokenExpiresIn: IDENTITY_ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: IDENTITY_REFRESH_TOKEN_EXPIRES_IN,
  idTokenExpiresIn: IDENTITY_ID_TOKEN_EXPIRES_IN
};

const services = [
  {
    definition: {
      serviceName: "Identity",
      pckg: "identity",
      version: "v1beta2",
      proto: "identity.proto"
    },
    handlers: {
      // Group operations
      createGroup: createGroup(prisma),
      deleteGroup: deleteGroup(prisma),
      getGroupById: getGroupById(prisma),
      updateGroup: updateGroup(prisma),
      listGroups: listGroups(prisma),
      inviteUserToGroup: inviteUserToGroup(prisma, sendInvite),
      resendGroupMembershipInvitation: resendGroupMembershipInvitation(
        prisma,
        sendInvite
      ),
      removeUserFromGroup: removeUserFromGroup(prisma),
      // User operations
      createUser: createUser(prisma),
      getUserById: getUserById(prisma),
      deleteUser: deleteUser(prisma),
      updateUser: updateUser(prisma),
      // API Key operations
      createApiKey: createAPIKey(prisma),
      deleteApiKey: deleteAPIKey(prisma),
      listApiKeys: listAPIKeys(prisma),
      regenerateApiKey: regenerateAPIKey(prisma),
      // Exchanges
      exchangeCredentials: exchangeCredentials(prisma, identityConfig),
      refreshToken
    }
  }
];

export default services;