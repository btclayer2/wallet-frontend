import React, { useState, useEffect } from 'react';
import { Table, Input, AddressSmall } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { useApi, useCall } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import SubnetDetail from './SubnetDetail.js';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';

interface Props {
  className?: string;
}

interface SubnetInfo {
  netuid: number;
  rho: number;
  kappa: number;
  difficulty: number;
  immunity_period: number;
  max_allowed_validators: number;
  min_allowed_weights: number;
  max_weights_limit: number;
  scaling_law_power: number;
  subnetwork_n: number;
  max_allowed_uids: number;
  blocks_since_last_step: number;
  tempo: number;
  network_modality: number;
  network_connect: any[];
  emission_values: number;
  burn: number;
  recycled: number;
  owner: string;
  identity: {
    subnet_name: number[];
    github_repo: number[];
    subnet_contact: number[];
  };
}

function Subnet({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);

  useEffect((): void => {
    callXAgereRpc('xagere_getSubnetsInfo_v2', [], systemChain)
      .then(response => {
        console.log('xagere_getSubnetsInfo_v2 Response:', response);
        if (Array.isArray(response)) {
          setSubnets(response);
        }
      })
      .catch(error => {
        console.error('xagere_getSubnetsInfo_v2 Error:', error);
      });
  }, [systemChain]);

  const header = [
    [t('Agere ID'), 'start', undefined],
    [t('Agere Name'), 'start', undefined],
    [t('Agere Owner'), 'start', undefined],
    [t('Earn(24h)'), 'start', undefined],
    [t('Recycled (Total)'), 'start', undefined],
    [t('Register Fee'), 'start', undefined],
    [t('Participants'), 'start', undefined]
  ] as [React.ReactNode?, string?, number?, (() => void)?][];

  const asciiToString = (ascii: number[]): string => {
    return ascii ? ascii.map(code => String.fromCharCode(code)).join('') : '-';
  };

  const filterSubnets = (data: SubnetInfo[]): SubnetInfo[] => {
    if (!filter) return data;

    const searchTerm = filter.toLowerCase();
    return data.filter((subnet) => {
      const searchableFields = [
        subnet.netuid.toString(),
        asciiToString(subnet.identity?.subnet_name),
        subnet.owner,
        formatBEVM(subnet.emission_values),
        formatBEVM(subnet.recycled),
        subnet.difficulty.toString()
      ];

      return searchableFields.some(field =>
        field.toLowerCase().includes(searchTerm)
      );
    });
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <>
      {/*{!selectedId ? (*/}
      {/*  <div className={className}>*/}
      {/*    <div style={{*/}
      {/*      background: 'white',*/}
      {/*      borderRadius: '0.25rem',*/}
      {/*      marginBottom: '1rem',*/}
      {/*      padding: '1rem'*/}
      {/*    }}>*/}
      {/*      <Input*/}
      {/*        autoFocus*/}
      {/*        isFull*/}
      {/*        onChange={handleFilterChange}*/}
      {/*        label={t('filter by Subnet ID, Subnet Name, Subnet Owner')}*/}
      {/*        value={filter}*/}
      {/*      />*/}
      {/*    </div>*/}

      {/*    <Table*/}
      {/*      empty={t('No subnets found')}*/}
      {/*      header={header}*/}
      {/*      style={{*/}
      {/*        '& td': {*/}
      {/*          padding: '1rem',*/}
      {/*          borderBottom: '1px solid var(--border-table)',*/}
      {/*          textAlign: 'start'*/}
      {/*        }*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {filterSubnets(subnets)?.map((subnet) => (*/}
      {/*        <tr*/}
      {/*          key={subnet.netuid}*/}
      {/*          onClick={() => setSelectedId(subnet.netuid.toString())}*/}
      {/*          style={{*/}
      {/*            height: '70px',*/}
      {/*            cursor: 'pointer'*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <td>{subnet.netuid}</td>*/}
      {/*          <td>{asciiToString(subnet.identity?.subnet_name)}</td>*/}
      {/*          <td><AddressSmall value={subnet.owner} /></td>*/}
      {/*          <td>*/}
      {/*            <TotalReturnWithTips key={`${subnet.netuid}`} value={formatBEVM(subnet.emission_values * 24)}/>*/}
      {/*          </td>*/}
      {/*          <td>{formatBEVM(subnet.recycled)}</td>*/}
      {/*          <td>{formatBEVM(subnet.burn)}</td>*/}
      {/*          <td>{subnet.subnetwork_n + "/" + subnet.max_allowed_uids}</td>*/}
      {/*        </tr>*/}
      {/*      ))}*/}
      {/*    </Table>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <SubnetDetail*/}
      {/*    subnetId={selectedId}*/}
      {/*    onClose={() => setSelectedId(null)}*/}
      {/*  />*/}
      {/*)}*/}
      <div className={className}>
        <div style={{
          background: 'white',
          borderRadius: '0.25rem',
          marginBottom: '1rem',
          padding: '1rem'
        }}>
          <Input
            autoFocus
            isFull
            onChange={handleFilterChange}
            label={t('filter by Agere ID, Agere Name, Agere Owner')}
            value={filter}
          />
        </div>

        <Table
          empty={t('No ageres found')}
          header={header}
          style={{
            '& td': {
              padding: '1rem',
              borderBottom: '1px solid var(--border-table)',
              textAlign: 'start'
            }
          }}
        >
          {filterSubnets(subnets)?.map((subnet) => (
            <tr
              key={subnet.netuid}
              onClick={() => setSelectedId(subnet.netuid.toString())}
              style={{
                height: '70px',
                cursor: 'pointer'
              }}
            >
              <td>{subnet.netuid}</td>
              <td>{asciiToString(subnet.identity?.subnet_name)}</td>
              <td><AddressSmall value={subnet.owner} /></td>
              <td>
                <TotalReturnWithTips key={`${subnet.netuid}`} value={formatBEVM(subnet.emission_values * 24)}/>
              </td>
              <td>{formatBEVM(subnet.recycled)}</td>
              <td>{formatBEVM(subnet.burn)}</td>
              <td>{subnet.subnetwork_n + "/" + subnet.max_allowed_uids}</td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
}

export default React.memo(Subnet);
