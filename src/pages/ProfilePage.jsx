import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Avatar, Typography, Row, Col, Divider } from 'antd';
import { UserOutlined, HighlightOutlined } from '@ant-design/icons';
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
const { Title } = Typography;

const API_SERVER = 'https://api2.aleph.im';
const CHANNEL = 'TEST';

function from_provider(provider) {
  // You should likely pass Wallet from '@project-serum/sol-wallet-adapter'
  console.log('called', provider);
  if (provider)
    return {
      private_key: null,
      public_key: provider.publicKey.toString(),
      address: provider.publicKey.toString(),
      name: provider.publicKey.toString(),
      type: 'SOL',
      source: 'provider',
      provider: provider,
    };
  else return null;
}

export default function Profile() {
  const { connected, wallet, providerUrl, setProvider } = useWallet();
  console.log(connected, wallet);

  const account = useMemo(() => (connected ? from_provider(wallet) : null), [
    connected,
    wallet,
  ]);
  console.log(account);

  const [profile, setProfile] = useState({});

  async function save_name(new_value) {
    await aggregates.submit(
      account.address,
      'profile',
      { name: new_value },
      { account: account, channel: CHANNEL },
    );
    await update_profile();
  }

  async function update_profile() {
    if (account) {
      let profile = await aggregates.fetch_one(account.address, 'profile', {
        api_server: API_SERVER,
      });
      if (profile) {
        setProfile(profile);
      } else {
        setProfile({});
      }
    }
  }

  useMemo(update_profile, [account]);

  return (
    <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      {account && (
        <Tabs defaultActiveKey="profile">
          <TabPane tab="My Profile" key="profile">
            <Row align="middle" gutter={16}>
              <Col>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col flex="auto">
                <Title
                  level={4}
                  editable={{
                    icon: <HighlightOutlined />,
                    tooltip: 'click to edit text',
                    onChange: save_name,
                  }}
                >
                  {profile.name ? profile.name : account.address}
                </Title>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Trades" key="trades">
            Here I can see my trades.
          </TabPane>
        </Tabs>
      )}
    </FloatingElement>
  );
}
