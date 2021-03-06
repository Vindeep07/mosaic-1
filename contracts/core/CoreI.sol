pragma solidity ^0.5.0;

// Copyright 2019 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

interface CoreI {
    function joinDuringCreation(address _validator) external;

    function join(address _validator) external;

    function logout(address _validator) external;

    function openMetablock(
        bytes32 _committedOriginObservation,
        uint256 _committedDynasty,
        uint256 _committedAccumulatedGas,
        bytes32 _committedCommitteeLock,
        bytes32 _committedSource,
        bytes32 _committedTarget,
        uint256 _committedSourceBlockHeight,
        uint256 _committedTargetBlockHeight,
        uint256 _deltaGasTarget
    ) external;
}