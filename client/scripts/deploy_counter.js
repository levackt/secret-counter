#!/usr/bin/env node

/* eslint-disable @typescript-eslint/camelcase */
const { EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey } = require("secretjs");
const fs = require("fs");

const httpUrl = "http://localhost:1317";
const faucet = {
  mnemonic:
    "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone",
  address: "secret1cdycaskx8g9gh9zpa5g8ah04ql0lzkrsxmcnfq",
};

const customFees = {
  upload: {
    amount: [{ amount: "25000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "0", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "0", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "2000", denom: "uscrt" }],
    gas: "80000",
  },
}
async function main() {
  const signingPen = await Secp256k1Pen.fromMnemonic(faucet.mnemonic);
    const myWalletAddress = pubkeyToAddress(
      encodeSecp256k1Pubkey(signingPen.pubkey),
      "secret"
    );
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  const client = new SigningCosmWasmClient(
    httpUrl,
    myWalletAddress,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed, customFees
  );

  const wasm = fs.readFileSync(__dirname + "/../../contracts/contract.wasm");
  const uploadReceipt = await client.upload(wasm, {})
  console.info(`Upload succeeded. Receipt: ${JSON.stringify(uploadReceipt)}`);

  const memo = `Counter`;
  const initMsg = {"count": 0}
  const { contractAddress } = await client.instantiate(uploadReceipt.codeId, initMsg, memo);
  console.info(`Contract instantiated at ${contractAddress}`);
}

main().then(
  () => {
    console.info("Counter deployed.");
    process.exit(0);
  },
  error => {
    console.error(error);
    process.exit(1);
  },
);


