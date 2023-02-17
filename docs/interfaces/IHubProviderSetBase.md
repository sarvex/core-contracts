# IHubProviderSetBase

*Polygon Technology*

> HubProviderSet

Provider set genesis contract for Polygon Hub.

*The contract is used to complete provider registration and store self-stake and delegated MATIC amounts. It manages staking, epoch committing, and reward distribution.*

## Methods

### getCurrentProviderSet

```solidity
function getCurrentProviderSet() external view returns (address[])
```

Gets addresses of active providers in this epoch, sorted by total stake (self-stake + delegation)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | Array of addresses of active providers in this epoch, sorted by total stake |

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

### totalActiveStake

```solidity
function totalActiveStake() external view returns (uint256)
```

Calculates total stake of active validators (self-stake + delegation).




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Total stake of active validators (in MATIC wei) |




