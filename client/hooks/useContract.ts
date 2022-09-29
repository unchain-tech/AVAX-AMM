import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import UsdcArtifact from "../utils/USDCToken.json";
import JoeArtifact from "../utils/USDCToken.json";
import AmmArtifact from "../utils/AMM.json";
import { USDCToken as UsdcType } from "../typechain-types";
import { JOEToken as JoeType } from "../typechain-types";
import { AMM as AmmType } from "../typechain-types";
import { getEthereum } from "../utils/ethereum";

export const UsdcAddress = "0x3C25603dD3Af61597bb6c9D15B76F68d9926F385";
export const JoeAddress = "0xAc3bB21014CBf5a671AFB199B1D2B9a30116604F";
export const AmmAddress = "0xE8430Ce3f3A5d4A0E63f5C69e93574e8c9C12db0";

export type TokenInfo = {
  symbol: string;
  address: string;
  contract: UsdcType | JoeType; //TODO ERC20+faucetのインターフェースで定義
};

type ReturnUseContract = {
  tokens: TokenInfo[];
  ammContract: AmmType | undefined;
  sharePrecision: BigNumber | undefined;
};

export const useContract = (
  currentAccount: string | undefined
): ReturnUseContract => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [ammContract, setAmmContract] = useState<AmmType>();
  const [sharePrecision, setSharePrecision] = useState<BigNumber>();
  const ethereum = getEthereum();

  const getContract = (
    contractAddress: string,
    abi: ethers.ContractInterface,
    storeContract: (_: ethers.Contract) => void
  ) => {
    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return;
    }
    // TODO 下記を実装した際に, ウォレットに非接続(コントラクトのオブジェクトはあるが呼び出しは失敗する状態)から接続に切り替え後に関数呼び出しが成功するか確認する
    // TODO 以下URL参考にcurrentAccountの必要性をコメントで書いておく, 接続していないで関数を呼び出すとaccount#0がないと言われる
    // https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider-getSigner
    if (!currentAccount) {
      console.log("currentAccount doesn't exist!");
      return;
    }
    try {
      // @ts-ignore: ethereum as ethers.providers.ExternalProvider
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(); // 簡易実装のため, 引数なし = 初めのアカウント(account#0)を使用する
      const Contract = new ethers.Contract(contractAddress, abi, signer);
      storeContract(Contract);
    } catch (error) {
      console.log(error);
    }
  };

  const addTokenInfo = async (
    address: string,
    contract: UsdcType | JoeType
  ) => {
    try {
      const symbol = await contract.symbol();
      setTokens((prevState) => [
        ...prevState,
        {
          symbol: symbol,
          address: address,
          contract: contract,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getPrecision = async () => {
    if (!ammContract) {
      return;
    }
    try {
      const p = await ammContract.PRECISION();
      setSharePrecision(p);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getContract(UsdcAddress, UsdcArtifact.abi, (Contract: ethers.Contract) => {
      addTokenInfo(UsdcAddress, Contract as UsdcType);
    });
    getContract(JoeAddress, JoeArtifact.abi, (Contract: ethers.Contract) => {
      addTokenInfo(JoeAddress, Contract as JoeType);
    });
    getContract(AmmAddress, AmmArtifact.abi, (Contract: ethers.Contract) => {
      setAmmContract(Contract as AmmType);
    });
  }, [ethereum, currentAccount]);

  useEffect(() => {
    getPrecision();
  }, [ammContract]);

  return {
    ammContract: ammContract,
    tokens: tokens,
    sharePrecision: sharePrecision,
  };
};
