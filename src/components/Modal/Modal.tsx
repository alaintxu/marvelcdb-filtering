import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack, Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { Button } from '@astryxdesign/core/Button';

type Props = {
  children: React.ReactNode,
  title: string,
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  onCancel?: () => void,
  onAccept?: () => void
}

const Modal = ({ children, title, isOpen, onOpenChange, onCancel, onAccept }: Props) => {
  const {t} = useTranslation('modal');
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      width="min(90vw, 900px)"
      maxHeight="80dvh">
      <Layout
        header={<DialogHeader title={title} onOpenChange={onOpenChange} />}
        content={<LayoutContent>{children}</LayoutContent>}
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2} justify="end">
              <Button
                label={t('close')}
                variant="secondary"
                onClick={() => {
                  onOpenChange(false);
                  if (onCancel) onCancel();
                }} />
              {onAccept && <Button
                label={t('continue')}
                variant="primary"
                onClick={() => {
                  onAccept();
                  onOpenChange(false);
                }} />
              }
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  )
}

export default Modal