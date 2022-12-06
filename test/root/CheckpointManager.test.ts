import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish, BigNumber } from "ethers";
import * as mcl from "../../ts/mcl";
import { expandMsg } from "../../ts/hashToField";
import { randomBytes, hexlify, arrayify } from "ethers/lib/utils";
import { BLS, BN256G2, CheckpointManager } from "../../typechain";

const DOMAIN = ethers.utils.hexlify(ethers.utils.randomBytes(32));

describe("CheckpointManager", () => {
  let bls: BLS,
    bn256G2: BN256G2,
    governance: string,
    checkpointManager: CheckpointManager,
    submitCounter: number,
    startBlock: number,
    validatorSetSize: number,
    eventRoot: any,
    validatorSecretKeys: any[],
    validatorSet: any[],
    accounts: any[]; // we use any so we can access address directly from object
  before(async () => {
    await mcl.init();
    accounts = await ethers.getSigners();

    governance = accounts[0].address;

    const BLS = await ethers.getContractFactory("BLS");
    bls = await BLS.deploy();
    await bls.deployed();

    const BN256G2 = await ethers.getContractFactory("BN256G2");
    bn256G2 = await BN256G2.deploy();
    await bn256G2.deployed();

    const CheckpointManager = await ethers.getContractFactory("CheckpointManager");
    checkpointManager = await CheckpointManager.deploy();
    await checkpointManager.deployed();

    eventRoot = ethers.utils.randomBytes(32);
  });

  it("Initialize and validate initialization", async () => {
    validatorSetSize = Math.floor(Math.random() * (5 - 1) + 8); // Randomly pick 8 - 12

    validatorSecretKeys = [];
    validatorSet = [];
    for (let i = 0; i < validatorSetSize; i++) {
      const { pubkey, secret } = mcl.newKeyPair();
      validatorSecretKeys.push(secret);
      validatorSet.push({
        _address: accounts[i].address,
        blsKey: mcl.g2ToHex(pubkey),
        votingPower: ethers.utils.parseEther(((i + 1) * 2).toString()),
      });
    }

    await checkpointManager.initialize(bls.address, bn256G2.address, DOMAIN, validatorSet);
    expect(await checkpointManager.bls()).to.equal(bls.address);
    expect(await checkpointManager.bn256G2()).to.equal(bn256G2.address);
    expect(await checkpointManager.domain()).to.equal(DOMAIN);
    expect(await checkpointManager.currentValidatorSetLength()).to.equal(validatorSetSize);

    for (let i = 0; i < validatorSetSize; i++) {
      const validator = await checkpointManager.currentValidatorSet(i);
      expect(validator._address).to.equal(accounts[i].address);
      expect(validator.votingPower).to.equal(ethers.utils.parseEther(((i + 1) * 2).toString()));
    }

    const endBlock = (await checkpointManager.checkpoints(0)).blockNumber;
    expect(endBlock).to.equal(0);
    startBlock = endBlock.toNumber() + 1;
    const prevId = await checkpointManager.currentEpoch();
    submitCounter = prevId.toNumber() + 1;
  });

  it("Submit checkpoint with invalid signature", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 0,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapStr = "ffff";

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId + 1, //for signature verify fail
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await expect(
      checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
    ).to.be.revertedWith("SIGNATURE_VERIFICATION_FAILED");
  });

  it("Submit checkpoint with empty bitmap", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 1,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapStr = "00";

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await expect(
      checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
    ).to.be.revertedWith("BITMAP_IS_EMPTY");
  });

  it("Submit checkpoint with not enough voting power", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 1,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapStr = "01";

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await expect(
      checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
    ).to.be.revertedWith("INSUFFICIENT_VOTING_POWER");
  });

  it("Submit checkpoint success", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 1,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    // const bitmapNum = Math.floor(Math.random() * 0xffffffffffffffff);
    // let bitmapStr = bitmapNum.toString(16);
    // const length = bitmapStr.length;
    // for (let j = 0; j < 16 - length; j++) {
    //   bitmapStr = "0" + bitmapStr;
    // }

    // const bitmap = `0x${bitmapStr}`;
    const bitmap = "0xffff";
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap);

    expect(await checkpointManager.getEventRootByBlock(checkpoint.blockNumber)).to.equal(checkpoint.eventRoot);
    expect(await checkpointManager.checkpointBlockNumbers(0)).to.equal(checkpoint.blockNumber);

    const leafIndex = 0;
    let proof = [];
    proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
    await checkpointManager.getEventMembershipByBlockNumber(
      checkpoint.blockNumber,
      checkpoint.eventRoot,
      leafIndex,
      proof
    );
    await checkpointManager.getEventMembershipByEpoch(checkpoint.epoch, checkpoint.eventRoot, leafIndex, proof);
  });

  it("Submit checkpoint with invalid epoch", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 0,
      blockNumber: 0,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapStr = "ffff";

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await expect(
      checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
    ).to.be.revertedWith("INVALID_EPOCH");
  });

  it("Submit checkpoint with empty checkpoint", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 0,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapStr = "ffff";

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await expect(
      checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
    ).to.be.revertedWith("EMPTY_CHECKPOINT");
  });

  it("Submit checkpoint success with same epoch", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 2,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    // const bitmapNum = Math.floor(Math.random() * 0xffffffffffffffff);
    // let bitmapStr = bitmapNum.toString(16);
    // const length = bitmapStr.length;
    // for (let j = 0; j < 16 - length; j++) {
    //   bitmapStr = "0" + bitmapStr;
    // }

    // const bitmap = `0x${bitmapStr}`;
    const bitmap = "0xffff";
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(ethers.utils.formatEther(validatorSet[i].votingPower), 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    await checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap);

    expect(await checkpointManager.getEventRootByBlock(checkpoint.blockNumber)).to.equal(checkpoint.eventRoot);
    expect(await checkpointManager.checkpointBlockNumbers(0)).to.equal(checkpoint.blockNumber);

    const leafIndex = 0;
    let proof = [];
    proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
    await checkpointManager.getEventMembershipByBlockNumber(
      checkpoint.blockNumber,
      checkpoint.eventRoot,
      leafIndex,
      proof
    );
    await checkpointManager.getEventMembershipByEpoch(checkpoint.epoch, checkpoint.eventRoot, leafIndex, proof);
  });

  it("Submit checkpoint success with short bitmap", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 2,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmap = "0xff";
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(validatorSet[i].votingPower, 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    if (aggVotingPower > (Number(await checkpointManager.totalVotingPower()) * 2) / 3) {
      await checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap);

      expect(await checkpointManager.getEventRootByBlock(checkpoint.blockNumber)).to.equal(checkpoint.eventRoot);
      expect(await checkpointManager.checkpointBlockNumbers(0)).to.equal(checkpoint.blockNumber);

      const leafIndex = 0;
      let proof = [];
      proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
      await checkpointManager.getEventMembershipByBlockNumber(
        checkpoint.blockNumber,
        checkpoint.eventRoot,
        leafIndex,
        proof
      );
      await checkpointManager.getEventMembershipByEpoch(checkpoint.epoch, checkpoint.eventRoot, leafIndex, proof);
    } else {
      await expect(
        checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
      ).to.be.revertedWith("INSUFFICIENT_VOTING_POWER");
    }
  });

  it("Get Event Membership By BlockNumber with invalid eventRoot", async () => {
    const blockNumber = 3;
    const leaf = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const leafIndex = 0;
    let proof = [];
    proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));

    await expect(
      checkpointManager.getEventMembershipByBlockNumber(blockNumber, leaf, leafIndex, proof)
    ).to.be.revertedWith("NO_EVENT_ROOT_FOR_BLOCK_NUMBER");
  });

  it("Get Event Membership By epoch with invalid eventRoot", async () => {
    const epoch = 2;
    const leaf = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const leafIndex = 0;
    let proof = [];
    proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));

    await expect(checkpointManager.getEventMembershipByEpoch(epoch, leaf, leafIndex, proof)).to.be.revertedWith(
      "NO_EVENT_ROOT_FOR_EPOCH"
    );
  });

  it("Submit checkpoint success with fuzzy bitmap", async () => {
    const chainId = submitCounter;
    const checkpoint = {
      epoch: 1,
      blockNumber: 1,
      eventRoot: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const checkpointMetadata = {
      blockHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
      blockRound: 0,
      currentValidatorSetHash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
    };

    const bitmapNum = Math.floor(Math.random() * 0xffffffffffffffff);
    let bitmapStr = bitmapNum.toString(16);
    const length = bitmapStr.length;
    for (let j = 0; j < 16 - length; j++) {
      bitmapStr = "0" + bitmapStr;
    }

    const bitmap = `0x${bitmapStr}`;
    const messageOfValidatorSet = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["tuple(address _address, uint256[4] blsKey, uint256 votingPower)[]"],
        [validatorSet]
      )
    );

    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint256", "uint256", "bytes32", "bytes32", "bytes32"],
        [
          chainId,
          checkpoint.blockNumber,
          checkpointMetadata.blockHash,
          checkpointMetadata.blockRound,
          checkpoint.epoch,
          checkpoint.eventRoot,
          checkpointMetadata.currentValidatorSetHash,
          messageOfValidatorSet,
        ]
      )
    );

    const signatures: mcl.Signature[] = [];

    let aggVotingPower = 0;
    for (let i = 0; i < validatorSecretKeys.length; i++) {
      const byteNumber = Math.floor(i / 8);
      const bitNumber = i % 8;

      if (byteNumber >= bitmap.length / 2 - 1) {
        continue;
      }

      // Get the value of the bit at the given 'index' in a byte.
      const oneByte = parseInt(bitmap[2 + byteNumber * 2] + bitmap[3 + byteNumber * 2], 16);
      if ((oneByte & (1 << bitNumber)) > 0) {
        const { signature, messagePoint } = mcl.sign(message, validatorSecretKeys[i], ethers.utils.arrayify(DOMAIN));
        signatures.push(signature);
        aggVotingPower += parseInt(validatorSet[i].votingPower, 10);
      } else {
        continue;
      }
    }

    const aggMessagePoint: mcl.MessagePoint = mcl.g1ToHex(mcl.aggregateRaw(signatures));

    if (aggVotingPower > (Number(await checkpointManager.totalVotingPower()) * 2) / 3) {
      await checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap);

      expect(await checkpointManager.getEventRootByBlock(checkpoint.blockNumber)).to.equal(checkpoint.eventRoot);
      expect(await checkpointManager.checkpointBlockNumbers(0)).to.equal(checkpoint.blockNumber);

      const leafIndex = 0;
      let proof = [];
      proof.push(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
      await checkpointManager.getEventMembershipByBlockNumber(
        checkpoint.blockNumber,
        checkpoint.eventRoot,
        leafIndex,
        proof
      );
      await checkpointManager.getEventMembershipByEpoch(checkpoint.epoch, checkpoint.eventRoot, leafIndex, proof);
    } else {
      if (aggVotingPower === 0) {
        await expect(
          checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
        ).to.be.revertedWith("BITMAP_IS_EMPTY");
      } else {
        await expect(
          checkpointManager.submit(chainId, checkpointMetadata, checkpoint, aggMessagePoint, validatorSet, bitmap)
        ).to.be.revertedWith("INSUFFICIENT_VOTING_POWER");
      }
    }
  });
});
