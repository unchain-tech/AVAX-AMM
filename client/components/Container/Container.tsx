import { useState } from "react";
import { USDCToken as UsdcType } from "../../typechain-types";
import { JOEToken as JoeType } from "../../typechain-types";
import { AMM as AmmType } from "../../typechain-types";
import styles from "./Container.module.css";
import Swap from "../SlectTab/Swap";
import Details from "../Details/Details";
import Faucet from "../SlectTab/Faucet";
import Withdraw from "../SlectTab/Withdraw";
import Provide from "../SlectTab/Provide";

type Props = {
  usdcContract: UsdcType | undefined;
  joeContract: JoeType | undefined;
  ammContract: AmmType | undefined;
  currentAccount: string | undefined;
};

//TODO: セレクトタブのところ, 同じcssで囲みたい
export default function Container({
  usdcContract,
  joeContract,
  ammContract,
  currentAccount,
}: Props) {
  const [activeTab, setActiveTab] = useState("Swap");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.centerBody}>
      <div className={styles.selectTab}>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === "Swap" ? styles.activeTab : "")
          }
          onClick={() => changeTab("Swap")}
        >
          Swap
        </div>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === "Provide" ? styles.activeTab : "")
          }
          onClick={() => changeTab("Provide")}
        >
          Provide
        </div>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === "Withdraw" ? styles.activeTab : "")
          }
          onClick={() => changeTab("Withdraw")}
        >
          Withdraw
        </div>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === "Faucet" ? styles.activeTab : "")
          }
          onClick={() => changeTab("Faucet")}
        >
          Faucet
        </div>
      </div>

      {activeTab === "Swap" && (
        <Swap
          usdcContract={usdcContract}
          joeContract={joeContract}
          ammContract={ammContract}
        />
      )}
      {activeTab === "Provide" && (
        <Provide
          usdcContract={usdcContract}
          joeContract={joeContract}
          ammContract={ammContract}
          currentAccount={currentAccount}
        />
      )}
      {activeTab === "Withdraw" && (
        <Withdraw
          usdcContract={usdcContract}
          joeContract={joeContract}
          ammContract={ammContract}
          currentAccount={currentAccount}
        />
      )}
      {activeTab === "Faucet" && (
        <Faucet
          usdcContract={usdcContract}
          joeContract={joeContract}
          currentAccount={currentAccount}
        />
      )}
      <Details
        usdcContract={usdcContract}
        joeContract={joeContract}
        ammContract={ammContract}
        currentAccount={currentAccount}
      />
    </div>
  );
}