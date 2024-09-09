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
import { Prisma } from "../../src/core/db";
import { TEST_TOKEN } from "../utils";

chai.use(chaiAsPromised);
chai.use(sinonChai);
const sandbox = createSandbox();

describe("@secrets/listSecrets", function () {
  afterEach(function () {
    return sandbox.restore();
  });

  it("should return a list of secrets", async function () {
    // Arrange
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const call = {
      metadata,
      request: {
        pageSize: 10,
        pageToken: "1"
      }
    };

    const secrets = [
      {
        ref: "123",
        name: "My Secret",
        secret: "123456",
        accessKeyId: "GRahn02s8tgdfghz72vb0fz538qpb5z35p",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const prisma = {
      secret: {
        findMany: sandbox.stub().resolves(secrets)
      }
    } as unknown as Prisma;

    const { listSecrets } = await import("../../src/secrets/listSecrets");

    // Act
    const response = await new Promise((resolve, reject) => {
      listSecrets(prisma)(call, (error, response) => {
        if (error) return reject(error);
        resolve(response);
      });
    });

    // Assert
    expect(response)
      .has.property("items")
      .to.be.an("array")
      .to.have.lengthOf(1);
    expect(response)
      .has.property("nextPageToken")
      .to.be.a("string")
      .to.equal("123");
  });

  it("should return an empty array if no secrets found", async function () {
    // Arrange
    const metadata = new grpc.Metadata();
    metadata.set("token", TEST_TOKEN);

    const call = {
      metadata,
      request: {
        pageSize: 10,
        pageToken: "1"
      }
    };

    const prisma = {
      secret: {
        findMany: sandbox.stub().resolves([])
      }
    } as unknown as Prisma;

    const { listSecrets } = await import("../../src/secrets/listSecrets");

    // Act
    const response = await new Promise((resolve, reject) => {
      listSecrets(prisma)(call, (error, response) => {
        if (error) return reject(error);
        resolve(response);
      });
    });

    // Assert
    expect(response)
      .has.property("items")
      .to.be.an("array")
      .to.have.lengthOf(0);
    expect(response).has.property("nextPageToken").to.be.undefined;
  });
});
