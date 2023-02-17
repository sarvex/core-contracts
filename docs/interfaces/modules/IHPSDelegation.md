# IHPSDelegation









## Methods

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



