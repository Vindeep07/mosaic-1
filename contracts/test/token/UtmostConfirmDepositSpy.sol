pragma solidity >=0.5.0 <0.6.0;

// Copyright 2020 OpenST Ltd.
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

import "../../utility-token/UtilityTokenInterface.sol";

/**
 * @title Utmost spy contract to test ConsensusCogateway::confirmDeposit.
 */
contract UtmostConfirmDepositSpy is UtilityTokenInterface {

    /* Storage */

    address[] public beneficiaries;
    uint256[] public amounts;


    /* External Functions. */

    /**
     * @notice Used for unit testing of ConsensusCogateway::confirmDeposit.
     *
     * @param _beneficiary Address of beneficiary where tokens are minted.
     * @param _amount Amount in wei.
     *
     * @return bool `true` if success else `false`.
     */
    function mint(
        address payable _beneficiary,
        uint256 _amount
    )
        external
        returns(bool)
    {
        beneficiaries.push(_beneficiary);
        amounts.push(_amount);
        return true;
    }

    /**
     * @notice Implemented to satisfy the interface definition.
     */
    function burn(address, uint256)
        external
        returns(bool)
    {
        require(false, 'This method should not be called.');
    }

}