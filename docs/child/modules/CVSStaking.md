# CVSStaking

## Methods

### ACTIVE_VALIDATOR_SET_SIZE

```solidity
function ACTIVE_VALIDATOR_SET_SIZE() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### MAX_COMMISSION

```solidity
function MAX_COMMISSION() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### MAX_VALIDATOR_SET_SIZE

```solidity
function MAX_VALIDATOR_SET_SIZE() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### NEW_VALIDATOR_SIG

```solidity
function NEW_VALIDATOR_SIG() external view returns (bytes32)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | bytes32 | undefined   |

### REWARD_PRECISION

```solidity
function REWARD_PRECISION() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### SPRINT

```solidity
function SPRINT() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### WITHDRAWAL_WAIT_PERIOD

```solidity
function WITHDRAWAL_WAIT_PERIOD() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### addToWhitelist

```solidity
function addToWhitelist(address[] whitelistAddreses) external nonpayable
```

Adds addresses that are allowed to register as validators.

#### Parameters

| Name              | Type      | Description                   |
| ----------------- | --------- | ----------------------------- |
| whitelistAddreses | address[] | Array of address to whitelist |

### bls

```solidity
function bls() external view returns (contract IBLS)
```

#### Returns

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| \_0  | contract IBLS | undefined   |

### claimOwnership

```solidity
function claimOwnership() external nonpayable
```

allows proposed owner to claim ownership (step 2 of transferring ownership)

_can only be called by the new proposed owner_

### claimValidatorReward

```solidity
function claimValidatorReward() external nonpayable
```

Claims validator rewards for sender.

### currentEpochId

```solidity
function currentEpochId() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### epochEndBlocks

```solidity
function epochEndBlocks(uint256) external view returns (uint256)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### epochReward

```solidity
function epochReward() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### epochs

```solidity
function epochs(uint256) external view returns (uint256 startBlock, uint256 endBlock, bytes32 epochRoot)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| startBlock | uint256 | undefined   |
| endBlock   | uint256 | undefined   |
| epochRoot  | bytes32 | undefined   |

### getValidator

```solidity
function getValidator(address validator) external view returns (struct Validator)
```

Gets validator by address.

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

#### Returns

| Name | Type      | Description                                                                                            |
| ---- | --------- | ------------------------------------------------------------------------------------------------------ |
| \_0  | Validator | Validator (BLS public key, self-stake, total stake, commission, withdrawable rewards, activity status) |

### getValidatorReward

```solidity
function getValidatorReward(address validator) external view returns (uint256)
```

Gets validator&#39;s unclaimed rewards.

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| validator | address | Address of validator |

#### Returns

| Name | Type    | Description                                      |
| ---- | ------- | ------------------------------------------------ |
| \_0  | uint256 | Validator&#39;s unclaimed rewards (in MATIC wei) |

### message

```solidity
function message(uint256) external view returns (uint256)
```

Message to sign for registration

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### minDelegation

```solidity
function minDelegation() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### minStake

```solidity
function minStake() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### owner

```solidity
function owner() external view returns (address)
```

the address of the owner

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### pendingWithdrawals

```solidity
function pendingWithdrawals(address account) external view returns (uint256)
```

Calculates how much is yet to become withdrawable for account.

#### Parameters

| Name    | Type    | Description                         |
| ------- | ------- | ----------------------------------- |
| account | address | The account to calculate amount for |

#### Returns

| Name | Type    | Description                                |
| ---- | ------- | ------------------------------------------ |
| \_0  | uint256 | Amount not yet withdrawable (in MATIC wei) |

### proposeOwner

```solidity
function proposeOwner(address payable newOwner) external nonpayable
```

proposes a new owner (step 1 of transferring ownership)

_can only be called by the current owner_

#### Parameters

| Name     | Type            | Description |
| -------- | --------------- | ----------- |
| newOwner | address payable | undefined   |

### proposedOwner

```solidity
function proposedOwner() external view returns (address)
```

the address of a proposed owner

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### register

```solidity
function register(uint256[2] signature, uint256[4] pubkey) external nonpayable
```

Validates BLS signature with the provided pubkey and registers validators into the set.

#### Parameters

| Name      | Type       | Description                           |
| --------- | ---------- | ------------------------------------- |
| signature | uint256[2] | Signature to validate message against |
| pubkey    | uint256[4] | BLS public key of validator           |

### removeFromWhitelist

```solidity
function removeFromWhitelist(address[] whitelistAddreses) external nonpayable
```

Deletes addresses that are allowed to register as validators.

#### Parameters

| Name              | Type      | Description                               |
| ----------------- | --------- | ----------------------------------------- |
| whitelistAddreses | address[] | Array of address to remove from whitelist |

### setCommission

```solidity
function setCommission(uint256 newCommission) external nonpayable
```

Sets commission for validator.

#### Parameters

| Name          | Type    | Description                 |
| ------------- | ------- | --------------------------- |
| newCommission | uint256 | New commission (100 = 100%) |

### sortedValidators

```solidity
function sortedValidators(uint256 n) external view returns (address[])
```

Gets first n active validators sorted by total stake.

#### Parameters

| Name | Type    | Description                            |
| ---- | ------- | -------------------------------------- |
| n    | uint256 | Desired number of validators to return |

#### Returns

| Name | Type      | Description                                                                                                                       |
| ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| \_0  | address[] | Returns array of addresses of first n active validators sorted by total stake, or fewer if there are not enough active validators |

### stake

```solidity
function stake() external payable
```

Stakes sent amount. Claims rewards beforehand.

### totalStake

```solidity
function totalStake() external view returns (uint256)
```

Calculates total stake in the network (self-stake + delegation).

#### Returns

| Name | Type    | Description                |
| ---- | ------- | -------------------------- |
| \_0  | uint256 | Total stake (in MATIC wei) |

### unstake

```solidity
function unstake(uint256 amount) external nonpayable
```

Unstakes amount for sender. Claims rewards beforehand.

#### Parameters

| Name   | Type    | Description       |
| ------ | ------- | ----------------- |
| amount | uint256 | Amount to unstake |

### whitelist

```solidity
function whitelist(address) external view returns (bool)
```

#### Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### withdraw

```solidity
function withdraw(address to) external nonpayable
```

Withdraws sender&#39;s withdrawable amount to specified address.

#### Parameters

| Name | Type    | Description            |
| ---- | ------- | ---------------------- |
| to   | address | Address to withdraw to |

### withdrawable

```solidity
function withdrawable(address account) external view returns (uint256 amount)
```

Calculates how much can be withdrawn for account in this epoch.

#### Parameters

| Name    | Type    | Description                         |
| ------- | ------- | ----------------------------------- |
| account | address | The account to calculate amount for |

#### Returns

| Name   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| amount | uint256 | Amount withdrawable (in MATIC wei) |

## Events

### AddedToWhitelist

```solidity
event AddedToWhitelist(address indexed validator)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |

### Initialized

```solidity
event Initialized(uint8 version)
```

#### Parameters

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| version | uint8 | undefined   |

### NewValidator

```solidity
event NewValidator(address indexed validator, uint256[4] blsKey)
```

#### Parameters

| Name                | Type       | Description |
| ------------------- | ---------- | ----------- |
| validator `indexed` | address    | undefined   |
| blsKey              | uint256[4] | undefined   |

### OwnershipProposed

```solidity
event OwnershipProposed(address indexed proposedOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| proposedOwner `indexed` | address | undefined   |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

#### Parameters

| Name                    | Type    | Description |
| ----------------------- | ------- | ----------- |
| previousOwner `indexed` | address | undefined   |
| newOwner `indexed`      | address | undefined   |

### RemovedFromWhitelist

```solidity
event RemovedFromWhitelist(address indexed validator)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |

### Staked

```solidity
event Staked(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Unstaked

```solidity
event Unstaked(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### ValidatorRewardClaimed

```solidity
event ValidatorRewardClaimed(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### ValidatorRewardDistributed

```solidity
event ValidatorRewardDistributed(address indexed validator, uint256 amount)
```

#### Parameters

| Name                | Type    | Description |
| ------------------- | ------- | ----------- |
| validator `indexed` | address | undefined   |
| amount              | uint256 | undefined   |

### Withdrawal

```solidity
event Withdrawal(address indexed account, address indexed to, uint256 amount)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| account `indexed` | address | undefined   |
| to `indexed`      | address | undefined   |
| amount            | uint256 | undefined   |

### WithdrawalRegistered

```solidity
event WithdrawalRegistered(address indexed account, uint256 amount)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| account `indexed` | address | undefined   |
| amount            | uint256 | undefined   |

## Errors

### AmountZero

```solidity
error AmountZero()
```

### Exists

```solidity
error Exists(address validator)
```

#### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| validator | address | undefined   |

### StakeRequirement

```solidity
error StakeRequirement(string src, string msg)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| src  | string | undefined   |
| msg  | string | undefined   |

### Unauthorized

```solidity
error Unauthorized(string only)
```

#### Parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| only | string | undefined   |