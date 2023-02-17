# IHPSStaking









## Methods

### claimProviderReward

```solidity
function claimProviderReward() external nonpayable
```

Claims provider rewards for sender.




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




### totalStake

```solidity
function totalStake() external view returns (uint256)
```

Calculates total stake in the network (self-stake + delegation).




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Total stake (in MATIC wei) |

### unstake

```solidity
function unstake(uint256 amount) external nonpayable
```

Unstakes amount for sender. Claims rewards beforehand.



#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount to unstake |



## Events

### NewProvider

```solidity
event NewProvider(address indexed provider, uint256[4] blsKey)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| blsKey  | uint256[4] | undefined |

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

### Unstaked

```solidity
event Unstaked(address indexed provider, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| provider `indexed` | address | undefined |
| amount  | uint256 | undefined |



