# HPSDelegation









## Methods

### ACTIVE_PROVIDER_SET_SIZE

```solidity
function ACTIVE_PROVIDER_SET_SIZE() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### MAX_COMMISSION

```solidity
function MAX_COMMISSION() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### MAX_PROVIDER_SET_SIZE

```solidity
function MAX_PROVIDER_SET_SIZE() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### NEW_VALIDATOR_SIG

```solidity
function NEW_VALIDATOR_SIG() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### REWARD_PRECISION

```solidity
function REWARD_PRECISION() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### WITHDRAWAL_WAIT_PERIOD

```solidity
function WITHDRAWAL_WAIT_PERIOD() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### bls

```solidity
function bls() external view returns (contract IBLS)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IBLS | undefined |

### claimDelegatorReward

```solidity
function claimDelegatorReward(address provider, bool restake) external nonpayable
```

Claims delegator rewards for sender.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Validator to claim from |
| restake | bool | Whether to redelegate the claimed rewards |

### currentEpochId

```solidity
function currentEpochId() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### delegate

```solidity
function delegate(address provider, bool restake) external payable
```

Delegates sent amount to provider. Claims rewards beforehand.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Validator to delegate to |
| restake | bool | Whether to redelegate the claimed rewards |

### delegationOf

```solidity
function delegationOf(address provider, address delegator) external view returns (uint256)
```

Gets amount delegated by delegator to provider.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Address of provider |
| delegator | address | Address of delegator |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Amount delegated (in MATIC wei) |

### epochEndBlocks

```solidity
function epochEndBlocks(uint256) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### epochReward

```solidity
function epochReward() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### epochSize

```solidity
function epochSize() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### epochs

```solidity
function epochs(uint256) external view returns (uint256 startBlock, uint256 endBlock, bytes32 epochRoot)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| startBlock | uint256 | undefined |
| endBlock | uint256 | undefined |
| epochRoot | bytes32 | undefined |

### getDelegatorReward

```solidity
function getDelegatorReward(address provider, address delegator) external view returns (uint256)
```

Gets delegators&#39;s unclaimed rewards with provider.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Address of provider |
| delegator | address | Address of delegator |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Delegator&#39;s unclaimed rewards with provider (in MATIC wei) |

### getProvider

```solidity
function getProvider(address provider) external view returns (struct Provider)
```

Gets validator by address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Provider | Validator (BLS public key, self-stake, total stake, commission, withdrawable rewards, activity status) |

### message

```solidity
function message(uint256) external view returns (uint256)
```

Message to sign for registration



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### minDelegation

```solidity
function minDelegation() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### minStake

```solidity
function minStake() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### pendingWithdrawals

```solidity
function pendingWithdrawals(address account) external view returns (uint256)
```

Calculates how much is yet to become withdrawable for account.



#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The account to calculate amount for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Amount not yet withdrawable (in MATIC wei) |

### undelegate

```solidity
function undelegate(address provider, uint256 amount) external nonpayable
```

Undelegates amount from provider for sender. Claims rewards beforehand.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Validator to undelegate from |
| amount | uint256 | The amount to undelegate |

### whitelist

```solidity
function whitelist(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### withdraw

```solidity
function withdraw(address to) external nonpayable
```

Withdraws sender&#39;s withdrawable amount to specified address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | Address to withdraw to |

### withdrawable

```solidity
function withdrawable(address account) external view returns (uint256 amount)
```

Calculates how much can be withdrawn for account in this epoch.



#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The account to calculate amount for |

#### Returns

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount withdrawable (in MATIC wei) |



## Events

### Delegated

```solidity
event Delegated(address indexed delegator, address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| delegator `indexed` | address | undefined |
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

### DelegatorRewardClaimed

```solidity
event DelegatorRewardClaimed(address indexed delegator, address indexed provider, bool indexed restake, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| delegator `indexed` | address | undefined |
| provider `indexed` | address | undefined |
| restake `indexed` | bool | undefined |
| amount  | uint256 | undefined |

### DelegatorRewardDistributed

```solidity
event DelegatorRewardDistributed(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### Undelegated

```solidity
event Undelegated(address indexed delegator, address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| delegator `indexed` | address | undefined |
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Withdrawal

```solidity
event Withdrawal(address indexed account, address indexed to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |

### WithdrawalRegistered

```solidity
event WithdrawalRegistered(address indexed account, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| amount  | uint256 | undefined |



## Errors

### StakeRequirement

```solidity
error StakeRequirement(string src, string msg)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| src | string | undefined |
| msg | string | undefined |

### Unauthorized

```solidity
error Unauthorized(string only)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| only | string | undefined |


