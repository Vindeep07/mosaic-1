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

import shared from '../shared';

const BN = require('bn.js');
const assert = require('assert');
import Utils from '../Utils';
import EventDecoder from '../event_decoder';
import { AssertionError } from 'assert';

describe('Deposit and Confirm Deposit', async () => {

  let depositParam;
  let valueToken;
  let ERC20Gateway;
  let ERC20Cogateway;
  let depositMessageHash;
  let gasPrice;
  let deposit_proof;
  let blockNumber;
  let storageProof;
  let accountProof;

  before(async () => {
    ERC20Gateway = shared.contracts.ERC20Gateway;
    ERC20Cogateway = shared.contracts.ERC20Cogateway;
    valueToken = shared.contracts.ValueToken.instance;
    gasPrice = "0x01"

    depositParam = {
      amount: new BN(100),
      beneficiary: shared.accounts[7],
      feeGasPrice: new BN(1),
      feeGasLimit: new BN(10),
      valueToken: shared.contracts.ValueToken.address, 
      depositor: shared.depositor,
    }
  });

  it('Deposit', async () => {
    
    await valueToken.methods.approve(
      ERC20Gateway.address,
      depositParam.amount,
    ).send(
      { from: depositParam.depositor },
    );

    const depositorBalanceBeforeTransfer = await valueToken.methods.balanceOf(depositParam.depositor).call();
    const erc20ContractBalanceBeforeTransfer = await valueToken.methods.balanceOf(ERC20Gateway.address).call();

    console.log(" Before Depositor Balance ===>>", depositorBalanceBeforeTransfer);
    console.log("Before Gateway Balance ==>", erc20ContractBalanceBeforeTransfer);
  
    const tx = await ERC20Gateway.instance.methods.deposit(
      depositParam.amount,
      depositParam.beneficiary,
      depositParam.feeGasPrice,
      depositParam.feeGasLimit,
      depositParam.valueToken,
    ).send(
      { 
        from: depositParam.depositor,
        gas: "1000000",
        gasPrice: "0x01",
       },
    );

    blockNumber = (await shared.web3.eth.getBlock('latest')).number;
    const outboxOffset = await ERC20Gateway.instance.methods.OUTBOX_OFFSET.call();

    const outboundChannelIdentifier = await ERC20Gateway.instance.methods.outboundChannelIdentifier().call();
    let nonce = await ERC20Gateway.instance.methods.nonces(depositParam.depositor).call();
    nonce = nonce - 1;
    const depositIntentHash = await Utils.getDepositIntentHash(
      depositParam.valueToken,
      depositParam.amount,
      depositParam.beneficiary,
    );

    depositMessageHash = await Utils.hashMessage(
      depositIntentHash,
      nonce,
      depositParam.feeGasPrice,
      depositParam.feeGasLimit,
      depositParam.depositor,
      outboundChannelIdentifier,
    );
    
    const path = await Utils.storagePath(outboxOffset, [depositMessageHash]);
    const proof = await shared.web3.eth.getProof(
      ERC20Gateway.address,
      [path],
      blockNumber,
    );

    accountProof = Utils.formatProof(proof.accountProof);
    storageProof = Utils.formatProof(proof.storageProof[0].proof);


    const outboxStatus = await ERC20Gateway.instance.methods.outbox(depositMessageHash).call();
      
    console.log('TX string  ', JSON.stringify(tx));
  
    const depositorBalanceAfterTransfer = await valueToken.methods.balanceOf(depositParam.depositor).call();
    const erc20ContractBalanceAfterTransfer = await valueToken.methods.balanceOf(ERC20Gateway.address).call();

    console.log("After Depositor Balance ==> ", depositorBalanceAfterTransfer);
    console.log("After Gateway bal===>", erc20ContractBalanceAfterTransfer);
  });

  it('Confirms deposit', async () => { 

  });
});