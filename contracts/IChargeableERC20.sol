// SPDX-License-Identifier: Apache-2.0+
// Author: Team Namefi by D3ServeLabs
// https://namefi.io
// https://d3serve.xyz
// Security Contact: security@d3serve.xyz

pragma solidity ^0.8.20;

interface IChargeableERC20 {
    event Charge(
        address charger,
        address chargee,
        uint256 amount,
        string reason,
        bytes extra
    );
    function charge(
        address charger,
        address chargee,
        uint256 amount,
        string memory reason,
        bytes memory extra
    ) external returns (bytes32);
}
