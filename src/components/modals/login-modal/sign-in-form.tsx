import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';

import { useAuth } from '@hooks/auth/useAuth';

import { SignInFormData } from '@data-types/user.type';

import { signInSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';

import { loginStep } from './login-modal';

interface SignInFormProps {
  setStep: (step: loginStep) => void;
}

const SignInForm: React.FC<SignInFormProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { signInWithEmail } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = useCallback(async ({ email, password }: SignInFormData) => {
    setLoading(true);
    await signInWithEmail(email, password).catch((err) => {
      toast.error(formatError(err as Error));
      console.error(err);
      setLoading(false);
    });
    // Do not setLoading(false) because Signin will unmount this component.
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-6"
        id="email"
        label="Email"
        placeholder="your@email.com"
        {...register('email')}
        errorText={errors.email?.message}
      />
      <TextInput
        className="mb-8"
        id="password"
        label="Password"
        type="password"
        placeholder="123456"
        withResetPassword
        goToResetPassword={() => props.setStep(loginStep.PASSWORD_RECOVERY)}
        {...register('password')}
        errorText={errors.password?.message}
      />
      <div className="flex justify-end space-x-4">
        <Button text="Back" theme="gray" onClick={() => props.setStep(loginStep.LOGIN_SELECTION)} />
        <Button theme="secondary" text="Continue" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default SignInForm;
