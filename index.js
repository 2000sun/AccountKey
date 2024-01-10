// 목적: Klaytn 블록체인에서 Legacy 계정 키를 사용하여 트랜잭션을 전송하고, 메시지 서명 및 복구를 수행하는 Node.js 스크립트입니다.

// 필요한 라이브러리 및 모듈 가져오기
const { ethers } = require("ethers");
const { Wallet,JsonRpcProvider} = require("@klaytn/ethers-ext");

// // 송신자(전송자) 및 수신자(받는 이) 주소 및 개인 키 설정
const senderAddr = "0xc4e0e85a0550288419fabe03f6443e7a9995d001";
const senderPriv = "0xddfd5ddd21722ef86b6133beb23b016b9d7f73cd4327161004a2215d24c99ff4";
const recieverAddr = "0x3577A303E59c5191d820EA67158a01af7859bb74";



// // Klaytn 노드 제공자 및 지갑 생성
const provider = new ethers.providers.JsonRpcProvider("https://public-en-baobab.klaytn.net");
const wallet = new Wallet(senderPriv, provider);

// 트랜잭션 전송 함수 정의
async function sendTx() {
  const tx = {
    from: senderAddr,
    to: recieverAddr,
    value: 0,
  };

  const sentTx = await wallet.sendTransaction(tx);
  console.log("sentTx", sentTx);

  const receipt = await sentTx.wait();
  console.log("receipt", receipt);
}
// 메시지 서명 및 복구 함수 정의

async function recoverMsg() {
  const msg = "hello";
  const msghex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(msg));

  const sig = await wallet.signMessage(msg);
  console.log({ senderAddr, msg, msghex, sig });

//   // 서명 복구를 통해 주소 검증 및 결과 출력
  const addr1 = ethers.utils.verifyMessage(msg, sig);
  console.log("recoveredAddr lib", addr1, addr1.toLowerCase() === senderAddr);
//   Klaytn 노드 RPC를 통한 서명 복구를 통해 주소 검증 및 결과 출력


  const addr2 = await provider.send("klay_recoverFromMessage", [senderAddr, msghex, sig, "latest"]);
  console.log("recoveredAddr rpc", addr2, addr2.toLowerCase() === senderAddr);
}

// 메인 함수 실행
async function main() {
  // await sendTx();
  await recoverMsg();
}
main().catch(console.error);




// 메시지 서명 및 복구는 
// 암호화폐와 블록체인에서 
// 사용되는 중요한 
// 보안 개념 
// 중 하나입니다.
//  이는 주로
// 공개키 암호화 기술을
// 기반으로 합니다.

// 1. 메시지 서명 (Message Signing)

//    보내는 측이 메시지에 서명하여 
//    메시지의 진위를 입증하는 과정입니다.
//    메시지를 개인 키로 서명하면
//    해당 서명은 
//    공개 키로 검증 가능합니다
//    서명된 메시지는 
//   블록체인 트랜잭션 
//   또는 메시지의 무결성과 송신자의 신원을 확인하는 데 사용됩니다.

// 2. 메시지 복구 (Message Recovery)
//    - 메시지가 서명되면,
//     해당 서명과 원본 메시지를 받아 
//     수신자는 
//     송신자의 공개 키를 사용하여 
//     서명의 유효성을 검증할 수 있습니다.
//    메시지 복구를 통해 
//    수신자는 메시지를 보낸 송신자의 신원을 확인할 수 있습니다.



// 스크립트에서 사용된
//  `wallet.signMessage` 함수는 
//  메시지 서명을 생성하는 데 사용되었습니다.
//   이는 개인 키를 사용하여 메시지에 서명을 추가하는 과정을 의미합니다.
//    또한, `ethers.utils.verifyMessage` 
//    및 `provider.send("klay_recoverFromMessage", ...)` 함수들은
//     메시지의 서명을 검증하고, 
//     해당 서명을 사용하여 송신자의 주소를 복구하는 과정을 나타냅니다.


// 메시지 서명 및 복구는
//  블록체인에서 안전한 통신과 
//  신원 확인을 위해 중요한 역할을 합니다.





