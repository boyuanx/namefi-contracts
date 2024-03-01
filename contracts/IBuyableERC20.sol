// SPDX-License-Identifier: Apache-2.0+
// Author: Team Namefi by D3ServeLabs
// https://namefi.io
// https://d3serve.xyz
// Security Contact: security@d3serve.xyz

pragma solidity ^0.8.20;
interface IBuyableERC20PriceOracle {
    // MUST have
    function price(
        address buyToken,
        address buyAmount,
        address payToken,
        address payAmount
    ) external view returns (uint256);
}

interface IBuyableERC20 {
    event IncreaseBuyableSupply(uint256 increaseBy);
    event BuyToken(
        address buyer,
        uint256 buyAmount,
        address indexed payToken, // address(0) for ethers
        uint256 payAmount
    );

    event SetPrice(address payToken, uint256 price);

    function increaseBuyableSupply(uint256 amount) external;

    function setPrice(address payToken, uint256 price) external;

    function price(address payToken) external view returns (uint256);

    function buy(
        uint256 buyAmount,
        address payToken,
        uint256 payAmount
    ) external payable;
}
