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
import * as protoLoader from "@grpc/proto-loader";

type ServiceDefinitionParams = {
  serviceName: string;
  pckg: string;
  proto: string;
  version: string;
};

const loadOptions = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

function createServiceDefiniton(
  params: ServiceDefinitionParams
): grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  const pathToProto = `${__dirname}/../protos/${params.proto}`;
  const definitions = protoLoader.loadSync(pathToProto, loadOptions);

  return grpc.loadPackageDefinition(definitions).fonoster[params.pckg][
    params.version
  ][params.serviceName].service;
}

export { createServiceDefiniton, ServiceDefinitionParams };