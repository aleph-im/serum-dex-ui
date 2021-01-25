import React, { Component } from 'react';
import { Tabs, Avatar } from 'antd';
import { FrownFilled, UserOutlined } from '@ant-design/icons';
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

function injectWallet(Component) {
  const InjectedWallet = function (props) {
    const { connected, wallet, providerUrl, setProvider } = useWallet();

    return <Component {...props} connected={connected} wallet={wallet} providerUrl={providerUrl} />;
  };
  return InjectedWallet;
}

class BalancesPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      wallet: null,
      connected: false,
      account: null
    }
  }
  
  async componentDidMount() {
    await this.setState({
      account: await solana.from_provider(this.props.wallet),
      connected: this.props.connected});
  }
  
  render() {
    return (
      <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="My Profile" key="profile">
          <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<UserOutlined />} 
          />,
            My profile comes here
          </TabPane>
          <TabPane tab="Trades" key="trades">
            Here I can see my trades.
          </TabPane>
        </Tabs>
      </FloatingElement>
    );
  }
}

export default injectWallet(BalancesPage)