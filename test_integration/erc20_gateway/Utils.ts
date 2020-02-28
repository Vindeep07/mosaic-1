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

const rlp = require('rlp');

import shared from './shared';
import BN = require('bn.js');
'use strict';

export default class Utils {
  /**
   * Fund address for gas with ETH
   * @param beneficiary Beneficiary Address.
   * @param funder Funder Address.
   * @param web3 Web3 instance.
   * @param value Amount in wei.
   */
  static fundAddressForGas(beneficiary: string, funder:string, web3, value: string) {
    return web3.eth.sendTransaction(
      {
        from: funder,
        to: beneficiary,
        value,
      },
    );
  }

  static async storagePath(
    storageIndex,
    mappings,
  ) {
    let path = '';
    if (mappings && mappings.length > 0) {
      mappings.map((mapping) => {
        path = `${path}${shared.web3.utils.padLeft(mapping, 64)}`;
        return path;
      });
    }
    path = `${path}${shared.web3.utils.padLeft(storageIndex, 64)}`;
    path = shared.web3.utils.sha3(path);
    return path;
  }

  static async formatProof(
    proof: any,
    ) {
    const formattedProof = proof.map(p => rlp.decode(p));
    return `0x${rlp.encode(formattedProof).toString('hex')}`;
  }

  static async getDepositIntentHash(
    valueToken,
    amount, 
    beneficiary
  ) {
    const DEPOSIT_INTENT_TYPEHASH = shared.web3.utils.soliditySha3('DepositIntent(address valueToken,uint256 amount,address beneficiary)');
    return shared.web3.utils.sha3(
      shared.web3.eth.abi.encodeParameters(
        ['bytes32', 'address', 'uint256', 'address'],
        [DEPOSIT_INTENT_TYPEHASH, valueToken, amount.toString(), beneficiary],
      ),
    );
  }

  static async hashMessage(
    intentHash,
    nonce,
    feeGasPrice,
    feeGasLimit,
    sender,
    channelIdentifier,
  ) {
    const MESSAGE_TYPEHASH = shared.web3.utils.keccak256(
      'Message(bytes32 intentHash,uint256 nonce,uint256 feeGasPrice,uint256 feeGasLimit,address sender)',
    );
    const typedMessageHash = shared.web3.utils.keccak256(
      shared.web3.eth.abi.encodeParameters(
        [
          'bytes32',
          'bytes32',
          'uint256',
          'uint256',
          'uint256',
          'address',
        ],
        [
          MESSAGE_TYPEHASH,
          intentHash,
          nonce,
          feeGasPrice,
          feeGasLimit,
          sender,
        ],
      ),
    );
  
    const messageHash_ = shared.web3.utils.soliditySha3(
      { t: 'bytes1', v: '0x19' },
      { t: 'bytes1', v: '0x4d' },
      { t: 'bytes32', v: channelIdentifier },
      { t: 'bytes32', v: typedMessageHash },
    );
  
    return messageHash_;
  }

  static async 
  /**
   * Send Transaction.
   * @param rawTx Raw Transaction object.
   * @param txOptions Transaction Options.
   */
  static async sendTransaction(
    rawTx: any,
    txOptions: {
      gas?: string,
      from: string
    }) {
    txOptions.gas = txOptions.gas
      ? txOptions.gas
      : (await rawTx.estimateGas()).toString();

    return rawTx.send(txOptions);
  }
}

