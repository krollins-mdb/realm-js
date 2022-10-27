////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { EJSON } from "bson";

import { User, assert, binding } from "../internal";

export type BaseSyncConfiguration = {
  user: User;
};

export type FlexibleSyncConfiguration = BaseSyncConfiguration & {
  flexible: true;
  partitionValue?: never;
};

export type PartitionSyncConfiguration = BaseSyncConfiguration & {
  flexible?: never;
  partitionValue: unknown;
};

export type SyncConfiguration = FlexibleSyncConfiguration | PartitionSyncConfiguration;

/** @internal */
export function toBindingSyncConfig(config: SyncConfiguration): binding.SyncConfig_Relaxed {
  if (config.flexible) {
    throw new Error("Flexible sync has not been implemented yet");
  }
  assert.instanceOf(config.user, User, "user");
  return {
    user: config.user.internal,
    partitionValue: EJSON.stringify(config.partitionValue as EJSON.SerializableTypes),
  };
}