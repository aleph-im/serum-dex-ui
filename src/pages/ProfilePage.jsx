import React, { useState, useEffect } from 'react';
import { Tabs, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useWallet, WALLET_PROVIDERS } from '../utils/wallet';
import {
  useAllOpenOrdersBalances,
  useWalletBalancesForAllMarkets,
} from '../utils/markets';
import FloatingElement from '../components/layout/FloatingElement';
import WalletBalancesTable from '../components/UserInfoTable/WalletBalancesTable';
import { useMintToTickers } from '../utils/tokens';
import { solana, aggregates } from 'aleph-js';

const { TabPane } = Tabs;

export default function Profile() {
  const { connected, wallet, providerUrl, setProvider } = useWallet();

  const [account, updateAccount] = useState();
  useEffect(() => {
    const getAccount = async () => {
      if (connected) {
        let acct = await solana.from_provider(wallet);
        console.log('connected', wallet, acct);
        updateAccount(acct);
      }
    };
    getAccount();
  }, []);

  return (
    <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      {JSON.stringify(connected)}
      {account}
      {account && account.address}
      <Tabs defaultActiveKey="profile">
        <TabPane tab="My Profile" key="profile">
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<UserOutlined />}
          />
          , My profile comes here
        </TabPane>
        <TabPane tab="Trades" key="trades">
          Here I can see my trades.
        </TabPane>
      </Tabs>
    </FloatingElement>
  );
}
