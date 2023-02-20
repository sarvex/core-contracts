// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IChildProxy {
    function canSubscribe(address provider) external returns (bool);

    function subscribe(address provider) external;
}
