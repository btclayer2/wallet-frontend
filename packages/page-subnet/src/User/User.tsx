import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, InputAddress, ToggleGroup } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import UserInfo from './UserInfo.tsx';
import SubnetPaticpants from './SubnetPaticpants.tsx';
import { Available } from '@polkadot/react-query';

interface Props {
  className?: string;
}

function User({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [typeIndex, setTypeIndex] = useState(0);
  const { allAccounts, hasAccounts } = useAccounts()
  const [selectedAccount, setSelectedAccount] = useState<string>(hasAccounts ? allAccounts[0] : '');

  const stashTypes = useRef([
    { text: t('User'), value: 'User' },
    { text: t('Subnet Paticipants'), value: 'Paticipants' },
  ]);

  const renderContent = () => {
    switch (stashTypes.current[typeIndex].value) {
      case 'User':
        return <UserInfo account={selectedAccount} />;
      case 'Paticipants':
        return <SubnetPaticpants account={selectedAccount} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`} style={{ padding: '1rem' }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: 'normal',
        marginBottom: '0.5rem'
      }}>{'User Dashboard'}</h3>

      <p style={{
        color: 'var(--color-text-light)',
        marginBottom: '2rem'
      }}>{t('This panel primarily displays information about user staking and users becoming subnet participants.')}</p>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '16px',
          marginBottom: '1rem',
          color: 'var(--color-text)'
        }}>{t('Current Account')}</h3>

        <InputAddress
          defaultValue={selectedAccount}
          label={t('accountId: AccountId')}
          onChange={(value: string | null) => setSelectedAccount(value || '')}
          type='account'
          labelExtra={
            <Available
              label={t('transferrable')}
              params={selectedAccount}
            />
          }
          withLabel
        />
      </div>

      <div className='tabs' style={{ marginBottom: '1rem' }}>
        <Button.Group>
          <ToggleGroup
            onChange={setTypeIndex}
            options={stashTypes.current}
            value={typeIndex}
          />
        </Button.Group>
      </div>
      {stashTypes.current[typeIndex].value === 'User' && <UserInfo account={selectedAccount} />}
      {stashTypes.current[typeIndex].value ===  'Paticipants'&& <SubnetPaticpants account={selectedAccount} />}
      {/*{renderContent()}*/}
    </div>
  );
}

export default React.memo(User);
