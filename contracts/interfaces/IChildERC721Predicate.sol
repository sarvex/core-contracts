// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IChildERC721.sol";
import "./IStateReceiver.sol";

interface IChildERC721Predicate is IStateReceiver {
    function initialize(
        address newL2StateSender,
        address newStateReceiver,
        address newRootERC721Predicate,
        address newChildTokenTemplate,
        address newNativeTokenRootAddress
    ) external;

    function onStateReceive(uint256 /* id */, address sender, bytes calldata data) external;

    function withdraw(IChildERC721 childToken, uint256 tokenId) external;

    function withdrawTo(IChildERC721 childToken, address receiver, uint256 tokenId) external;
}
