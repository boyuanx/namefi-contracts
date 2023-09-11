import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { deployByName } from "../utils/deployUtil";

const WAIT_FOR_BLOCK = 3;

task("d3bridge-logic-deploy", "Deploy the logic contract")
    .setAction(async function (taskArguments: TaskArguments, { ethers, run }) {
        const contractName = "D3BridgeNFT";
        const signers = await ethers.getSigners();
        const signer = signers[0];
        const { contract, tx } = await deployByName(
            ethers,
            contractName,
            [],
            signer);

        console.log(`Contract ${contractName} deployed to ${contract.address}`);

        // wait for a few blocks
        const WAIT_FOR_BLOCK = 6;
        console.log(`Waiting for ${WAIT_FOR_BLOCK} blocks...`);
        for (let i = 0; i < WAIT_FOR_BLOCK; i++) {
            console.log(`${i} time: ${new Date().toLocaleTimeString()}`);
            await tx.wait(i);
        }
        console.log(`Wait done for ${WAIT_FOR_BLOCK} blocks.`);
        // verify on etherscan
        await run("verify:verify", {
            address: contract.address
        });
        console.log(`Contract ${contractName} verified at ${contract.address}.`);
    });

task("d3bridge-proxy-deploy", "Deploy Transparent Upgradeable Proxy")
    .addParam("logic", "The address of the logic contract")
    .addParam("logicContractName", "The name of the logic contract")
    .addParam("admin", "The address of the proxyAdmin")
    .setAction(async function (taskArguments: TaskArguments, { ethers, run }) {
        const { contract: proxy } = await deployByName(
            ethers,
            "TransparentUpgradeableProxy",
            [
                taskArguments.logic,
                taskArguments.admin,
                // Initialization data
                [],
            ]
        );

        await proxy.deployed();
        let tx2 = proxy.deployTransaction;
        // attach contract to UnsafelyDestroyable
        const logic = await ethers.getContractAt(
            taskArguments.logicContractName,
            proxy.address);
        await logic.initialize();

        for (let i = 0; i < WAIT_FOR_BLOCK; i++) {
            console.log(`Block ${i}...`);
            await tx2.wait(i);
        }

        console.log(`Done waiting for the confirmation for contract TransparentUpgradeableProxy at ${proxy.address}`);
        await run("verify:verify", {
            address: proxy.address,
            constructorArguments: [
                taskArguments.logic,
                taskArguments.admin,
                // Initialization data
                [],
            ],
        }).catch(e => console.log(`Failure ${e} when verifying TransparentUpgradeableProxy at ${proxy.address}`));
        console.log(`Done verifying TransparentUpgradeableProxy at ${proxy.address}`);

    });

task("d3bridge-admin-deploy", "Deploy the ProxyAdmin contract")
    .setAction(async function (taskArguments: TaskArguments, { ethers, run }) {
        const { contract: proxyAdmin } = await deployByName(
            ethers,
            "ProxyAdmin",
            []
        );

        await proxyAdmin.deployed();
        let tx3 = proxyAdmin.deployTransaction;

        for (let i = 0; i < WAIT_FOR_BLOCK; i++) {
            console.log(`Block ${i}...`);
            await tx3.wait(i);
        }

        console.log(`Done waiting for the confirmation for contract proxyAdmin at ${proxyAdmin.address}`);
        await run("verify:verify", {
            address: proxyAdmin.address,
        }).catch(e => console.log(`Failure ${e} when verifying proxyAdmin at ${proxyAdmin.address}`));
        console.log(`Done verifying proxyAdmin at ${proxyAdmin.address}`);
    });
