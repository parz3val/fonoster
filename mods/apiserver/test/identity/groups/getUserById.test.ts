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
import * as grpc from "@grpc/grpc-js";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { createSandbox } from "sinon";
import sinonChai from "sinon-chai";
import { Prisma } from "../../../src/db";
import { TEST_TOKEN } from "../../testToken";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

describe("@apiserver[identity/groups/getGroupById]", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should get a group by id", async function () {
    // Arrange
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const call = {
      metadata,
      request: {
        id: "123"
      }
    };

    const group = {
      id: "123",
      name: "My Group",
      ownerId: "123",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const prisma = {
      group: {
        findUnique: sandbox.stub().resolves(group)
      }
    } as unknown as Prisma;

    const { getGroupById } = await import(
      "../../../src/identity/groups/getGroupById"
    );

    // Act
    const response = await new Promise((resolve, reject) => {
      getGroupById(prisma)(call, (error, response) => {
        if (error) return reject(error);
        resolve(response);
      });
    });

    // Assert
    expect(response).to.deep.equal(group);
  });

  it("should throw an error if group not found", async function () {
    // Arrange
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const call = {
      metadata,
      request: {
        id: "123"
      }
    };

    const prisma = {
      group: {
        findUnique: sandbox.stub().resolves(null)
      }
    } as unknown as Prisma;

    const { getGroupById } = await import(
      "../../../src/identity/groups/getGroupById"
    );

    // Act
    await getGroupById(prisma)(call, (error) => {
      // Assert
      expect(error).to.deep.equal({
        code: grpc.status.NOT_FOUND,
        message: "Group not found"
      });
    });
  });
});