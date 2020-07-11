#!/usr/bin/env node

/* eslint-disable @typescript-eslint/camelcase */

const fs = require("fs");

const httpUrl = "http://localhost:1317";
const faucet = {
  mnemonic:
    "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone",
  address: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
};

const initMsg = {
    denom: "uscrt",
    name: "secret counter"
};

async function main() {

  const pen = await Secp256k1Pen.fromMnemonic(faucet.mnemonic);
  const client = new SigningCosmWasmClient(httpUrl, faucet.address, signBytes => pen.sign(signBytes));

  const wasm = fs.readFileSync(__dirname + "/../contracts/contract.wasm");
  const uploadReceipt = await client.upload(wasm, codeMeta, "Counter code");
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  const memo = `Create a counter instance "${initMsg.name}"`;
  const { contractAddress } = await client.instantiate(uploadReceipt.codeId, initMsg, initMsg.name, memo);
  console.info(`Contract "${initMsg.name}" instantiated at ${contractAddress}`);
}

main().then(
  () => {
    console.info("Done deploying counter instance.");
    process.exit(0);
  },
  error => {
    console.error(error);
    process.exit(1);
  },
);