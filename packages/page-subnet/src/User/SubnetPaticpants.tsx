import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.js';
import { asciiToString, formatAddress, formatBEVM } from '../Utils/formatBEVM.js';
import DelegateeInfo from './DelegateInfo.tsx';
import RegisterInfo from './RegisterInfo.tsx';
import Icon from '@polkadot/react-components/Icon';
import Tooltip from '@polkadot/react-components/Tooltip';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';

interface Props {
  className?: string;
  account: string;
}

interface SubnetIdentity {
  subnet_name: number[];
  github_repo: number[];
  subnet_contact: number[];
}

interface HotkeyInfo {
  hotkey: string;
  coldkey: string;
  uid: number;
  netuid: number;
  active: boolean;
  stake: number;
  nominators: [string, number][];
  rank: number;
  rank_score: number;
  emission: number;
  incentive: number;
  consensus: number;
  trust: number;
  validator_trust: number;
  dividends: number;
  last_update: number;
  validator_permit: boolean;
  pruning_score: number;
  total_stake: number;
  return_per_1000: number;
  total_daily_return: number;
  subnet_identity: SubnetIdentity | null;
}

function SubnetParticipants ({ className, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [delegateData, setDelegateData] = useState<HotkeyInfo[]>([]);
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [openStakeHotAddress, setOpenStakeHotAddress] = useState<string>('');

  const header = [
    [t('Agere ID'), 'start'],
    [t('POS'), 'start'],
    [t('Agere Name'), 'start'],
    [t('Hot Address'), 'start'],
    [t('Your Stake'), 'start'],
    [t('Earn(24h)'), 'start'],
    [t('Validator status'), 'start'],
    [t('Validator Permit'), 'start'],
    [t('Executor status'), 'start'],
    [t('Operation'), 'start']
  ];

  const fetchDelegateData = (account: string, systemChain: string) => {
    callXAgereRpc('xagere_getColdkeyOwnedHotkeysInfo', [account], systemChain)
      .then(response => {
        console.log('xagere_getColdkeyOwnedHotkeysInfo Response:', response);
        if (Array.isArray(response)) {
          setDelegateData(response);
        }
      })
      .catch(error => {
        console.error('xagere_getColdkeyOwnedHotkeysInfo calling RPC:', error);
        setDelegateData([]);
      });
  };

  useEffect((): void => {
    fetchDelegateData(account, systemChain)
  }, [account, systemChain]);

  return (
    <div className={className}>
      <RegisterInfo account={account} onSuccess={()=>fetchDelegateData(account, systemChain)}/>
      <DelegateeInfo account={account} onSuccess={()=>fetchDelegateData(account, systemChain)}/>
      <div style={{
        background: 'white',
        borderRadius: '0.25rem'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'normal',
          padding: '1rem',
        }}>{t('Your Agere Participants Status')}</h2>

        <div style={{ background: 'transparent' }}>
        <Table
          empty={t('No participants found')}
          header={header}
          style={{
            '& td': {
              padding: '1rem',
              borderBottom: '1px solid var(--border-table)',
              textAlign: 'start'
            },
          }}
        >
          {delegateData
            ?.filter((info) => info.coldkey === account)
            ?.map(
              (info)=>{
                const yourStake = info.nominators.find(([addr]) => addr === account)?.[1] || 0;
                return <tr key={`${info.hotkey}-${info.netuid}`} className='ui--Table-Body' style={{height:'70px'}}>
                  <td className='number' style={{textAlign:'start'}}>{info.netuid}</td>
                  <td className='number' style={{textAlign:'start'}}>{info.rank}</td>
                  <td className='text' style={{textAlign:'start'}}>{info.subnet_identity ? asciiToString(info.subnet_identity.subnet_name) : '-'}</td>
                  <td className='text' style={{textAlign:'start'}}>{<AddressSmall value={info.hotkey} />}</td>
                  <td className='number' style={{textAlign:'start'}}>{formatBEVM(yourStake)}</td>
                  <td className='number' style={{textAlign:'start'}}>
                    <TotalReturnWithTips key={`${info.hotkey}-${info.netuid}`} value={formatBEVM(info.emission * 24)}/>
                  </td>
                  <td style={{textAlign:'start'}}>{info.validator_trust > 0 ? t('Active') : t('Inactive')}</td>
                  <td style={{textAlign:'start'}}>{info.validator_permit ? t('Yes') : t('No')}</td>
                  <td className='status' style={{textAlign:'start'}}>{info.trust > 0 ? t('Active') : t('Inactive')}</td>
                  <td>
                    <div style={{textAlign:'start'}}>
                      <Button
                        icon='plus'
                        isDisabled={!account}
                        label={t('Stake')}
                        onClick={()=>{toggleIsStakingOpen();setOpenStakeHotAddress(info.hotkey)}}
                      />
                      <Button
                        icon='minus'
                        isDisabled={!account}
                        label={t('UnStake')}
                        onClick={()=>{toggleIsUnStakingOpen();setOpenStakeHotAddress(info.hotkey)}}
                      />
                    </div>
                  </td>
                </tr>
              }
            )}
        </Table>
        </div>
      </div>
      {isStakingOpen && (
                        <StakingModal
                          account={account}
                          modelName={'Stake'}
                          toggleOpen={toggleIsStakingOpen}
                          hotAddress={openStakeHotAddress}
                          type={'addStake'}
                          name={'Stake'}
                          onSuccess={()=>fetchDelegateData(account, systemChain)}
                        />
                      )}
                      {isUnStakingOpen && (
                        <StakingModal account={account} modelName={'UnStake'} onSuccess={()=>fetchDelegateData(account, systemChain)}
    toggleOpen={toggleIsUnStakingOpen} hotAddress={openStakeHotAddress} type={'removeStake'} name={'UnStake'}/>
                      )}
    </div>
  );
}

export default React.memo(SubnetParticipants);
