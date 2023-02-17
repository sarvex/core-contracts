# HubProviderSet









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

### acceptOwnership

```solidity
function acceptOwnership() external nonpayable
```



*The new owner accepts the ownership transfer.*


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

### claimProviderReward

```solidity
function claimProviderReward() external nonpayable
```

Claims provider rewards for sender.




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

### getCurrentProviderSet

```solidity
function getCurrentProviderSet() external view returns (address[])
```

Gets addresses of active providers in this epoch, sorted by total stake (self-stake + delegation)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | Array of addresses of active providers in this epoch, sorted by total stake |

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

### getEpochByBlock

```solidity
function getEpochByBlock(uint256 blockNumber) external view returns (struct Epoch)
```

Look up an epoch by block number. Searches in O(log n) time.



#### Parameters

| Name | Type | Description |
|---|---|---|
| blockNumber | uint256 | ID of epoch to be committed |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Epoch | Epoch Returns epoch if found, or else, the last epoch |

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

### getProviderReward

```solidity
function getProviderReward(address provider) external view returns (uint256)
```

Gets provider&#39;s unclaimed rewards.



#### Parameters

| Name | Type | Description |
|---|---|---|
| provider | address | Address of provider |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Provider&#39;s unclaimed rewards (in MATIC wei) |

### initialize

```solidity
function initialize(IHubProviderSetBase.InitStruct init, address[] providerAddresses, uint256[4][] providerPubkeys, uint256[] providerStakes, contract IBLS newBls, uint256[2] newMessage, address governance) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| init | IHubProviderSetBase.InitStruct | undefined |
| providerAddresses | address[] | undefined |
| providerPubkeys | uint256[4][] | undefined |
| providerStakes | uint256[] | undefined |
| newBls | contract IBLS | undefined |
| newMessage | uint256[2] | undefined |
| governance | address | undefined |

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

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### pendingOwner

```solidity
function pendingOwner() external view returns (address)
```



*Returns the address of the pending owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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

### register

```solidity
function register(uint256[2] signature, uint256[4] pubkey) external nonpayable
```

Validates BLS signature with the provided pubkey and registers validators into the set.



#### Parameters

| Name | Type | Description |
|---|---|---|
| signature | uint256[2] | Signature to validate message against |
| pubkey | uint256[4] | BLS public key of provider |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setCommission

```solidity
function setCommission(uint256 newCommission) external nonpayable
```

Sets commission for provider.



#### Parameters

| Name | Type | Description |
|---|---|---|
| newCommission | uint256 | New commission (100 = 100%) |

### sortedProviders

```solidity
function sortedProviders(uint256 n) external view returns (address[])
```

Gets first n active validators sorted by total stake.



#### Parameters

| Name | Type | Description |
|---|---|---|
| n | uint256 | Desired number of validators to return |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | Returns array of addresses of first n active validators sorted by total stake, or fewer if there are not enough active validators |

### stake

```solidity
function stake() external payable
```

Stakes sent amount. Claims rewards beforehand.




### totalActiveStake

```solidity
function totalActiveStake() external view returns (uint256 activeStake)
```

Calculates total stake of active validators (self-stake + delegation).




#### Returns

| Name | Type | Description |
|---|---|---|
| activeStake | uint256 | Total stake of active validators (in MATIC wei) |

### totalStake

```solidity
function totalStake() external view returns (uint256)
```

Calculates total stake in the network (self-stake + delegation).




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Total stake (in MATIC wei) |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one. Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

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

### unstake

```solidity
function unstake(uint256 amount) external nonpayable
```

Unstakes amount for sender. Claims rewards beforehand.



#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount to unstake |

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

### NewProvider

```solidity
event NewProvider(address indexed provider, uint256[4] blsKey)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| blsKey  | uint256[4] | undefined |

### OwnershipTransferStarted

```solidity
event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### ProviderRewardClaimed

```solidity
event ProviderRewardClaimed(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

### ProviderRewardDistributed

```solidity
event ProviderRewardDistributed(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

### Staked

```solidity
event Staked(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |

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

### Unstaked

```solidity
event Unstaked(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
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

### AmountZero

```solidity
error AmountZero()
```






### Exists

```solidity
error Exists(address validator)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| validator | address | undefined |

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


