import { Button } from "@polkadot/react-components";
import { useTranslation } from '../translate.js';

import React from 'react';
import { useToggle } from '@polkadot/react-hooks';
import RegisterModal from "./RegisterModal.tsx";

interface Props {
  className?: string;
  account: string;
  onSuccess: () => void;
}


function RegisterInfo({ className, account, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isRegisterOpen, toggleIsRegisterOpen] = useToggle();

  return (
    <>
    <div style={{
        background: 'white',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'normal',
          padding: '1rem',
          borderBottom: '1px solid var(--border-table)'
        }}>{t('Register as a Subnet Participants')}</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <p style={{
            color: 'var(--color-text-light)',
            margin: 0,
            flex: 1,
            paddingRight: '2rem'
          }}>{t('Register as a validator/executor for any subnet, safeguard specific mainnets, and share in BEVM rewards.')}</p>

          <Button
            icon='plus'
            label={t('Register')}
            onClick={toggleIsRegisterOpen}
          />
        </div>
      </div>
      {isRegisterOpen && (
        <RegisterModal
          account={account}
          toggleOpen={toggleIsRegisterOpen}
          subnetId='1'
          onSuccess={onSuccess}
        />
      )}
    </>

  );
}

export default React.memo(RegisterInfo);