// AccountKeyPublic
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic

const { Wallet, TxType, AccountKeyType, parseKlay } = require("@klaytn/ethers-ext");
const { ethers } = require("ethers");

const senderAddr = "0x3577A303E59c5191d820EA67158a01af7859bb74";
const senderPriv = "0x7433ef0b2114f0fa756733afce177cefe930aa9cd351440d61ce7e42ffb168ea";
const senderNewPriv = "0xed4a890ffa1bb9065ce138adaa5e9f71163cd6ee37f2c4bbc0e2880ada909318";
const recieverAddr = "0xc4E0E85A0550288419fABe03F6443e7a9995D001";

const provider = new ethers.providers.JsonRpcProvider("https://public-en-baobab.klaytn.net");
const wallet = new Wallet(senderAddr, senderPriv, provider);
const newWallet = new Wallet(senderAddr, senderNewPriv, provider);



async function updateAccount() {

  let senderNewPub = ethers.utils.computePublicKey(senderNewPriv, true);

  const tx = {
    type: TxType.AccountUpdate,
    from: senderAddr,
    key: {
      type: AccountKeyType.Public,
      key: senderNewPub,
    }
  };

  const sentTx = await wallet.sendTransaction(tx);
  console.log("sentTx", sentTx);

  const receipt = await sentTx.wait();
  console.log("receipt", receipt);

}


async function sendTx() {
  let tx = {
    type: TxType.ValueTransfer,
    from: senderAddr,
    to: recieverAddr,
    value: parseKlay("0.01"),
  };

  const sentTx = await newWallet.sendTransaction(tx);
  console.log("sentTx", sentTx);

  const receipt = await sentTx.wait();
  console.log("receipt", receipt);
}

async function recoverMsg() {
  const msg = "hello";
  const msghex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(msg));
  const sig = await newWallet.signMessage(msg);
  console.log({ senderAddr, msg, msghex, sig });

  const addr1 = ethers.utils.verifyMessage(msg, sig);
  console.log("recoveredAddr lib", addr1, addr1.toLowerCase() === newWallet.address.toLowerCase());

  const addr2 = await provider.send("klay_recoverFromMessage", [senderAddr, msghex, sig, "latest"]);
  console.log("recoveredAddr rpc", addr2, addr2.toLowerCase() === newWallet.address.toLowerCase());
}


async function main() {
  // await updateAccount();
  await sendTx();
  // await recoverMsg();
}
main().catch(console.error);