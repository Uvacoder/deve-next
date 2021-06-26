import { ModalsStore, useModalsStore } from '@store/modals.store';
import React, { useState } from 'react';

import Button from '@components/elements/button';
import Separator from '@components/elements/separator';
import TextInput from '@components/elements/text-input';
import SignInWithGoogleBtn from '@components/sign-in-with-google-btn';

import { Modal } from './modal';

const authModalSelector = (state: ModalsStore) => state.authModal;
const toggleAuthModalSelector = (state: ModalsStore) => state.toggleAuthModal;

enum loginStep {
  LOGIN_SELECTION = 0,
  LOGIN_WITH_EMAIL,
  JOIN_NEXT_DEVE,
  PASSWORD_RECOVERY,
}

const LoginModal: React.FC = () => {
  const [step, setStep] = useState<loginStep>(loginStep.LOGIN_SELECTION);

  const authModal = useModalsStore(authModalSelector);
  const toggleAuthModal = useModalsStore(toggleAuthModalSelector);

  const renderTitle = (): string => {
    switch (step) {
      case loginStep.LOGIN_SELECTION:
        return 'Login';
      case loginStep.LOGIN_WITH_EMAIL:
        return 'Login with  email';
      case loginStep.JOIN_NEXT_DEVE:
        return 'Join DEVE-NEXT';
      case loginStep.PASSWORD_RECOVERY:
        return 'Password recovery';
    }
  };

  const renderContent = () => {
    switch (step) {
      case loginStep.LOGIN_SELECTION:
        return (
          <>
            <div className="grid gap-5">
              <SignInWithGoogleBtn />
              <Button text="login with github" fullWidth className="!bg-black" />
              <Button
                text="login with email"
                onClick={() => setStep(loginStep.LOGIN_WITH_EMAIL)}
                fullWidth
                className="bg-primary text-black"
              />
            </div>
            <Separator className="my-7" />
            <Button
              text="join next-deve"
              onClick={() => setStep(loginStep.JOIN_NEXT_DEVE)}
              fullWidth
              className="bg-primary text-black"
            />
          </>
        );
      case loginStep.LOGIN_WITH_EMAIL:
        return (
          <>
            <TextInput id="email" label="email" placeholder="Your email" />
            <TextInput id="email" label="email" type="password" placeholder="Your email" />
            <TextInput id="email" label="email" type="search" placeholder="Your email" />
          </>
        );
      case loginStep.JOIN_NEXT_DEVE:
        return null;
      case loginStep.PASSWORD_RECOVERY:
        return null;
    }
  };

  const closeModal = () => {
    toggleAuthModal();
    setStep(loginStep.LOGIN_SELECTION);
  };

  return (
    <Modal isOpen={authModal} closeModal={closeModal} title={renderTitle()}>
      {renderContent()}
    </Modal>
  );
};

export default LoginModal;
