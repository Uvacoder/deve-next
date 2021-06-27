import { EyeIcon, EyeOffIcon, SearchIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState, useCallback, ChangeEvent } from 'react';
import { FieldError } from 'react-hook-form';

interface TextInputProps {
  id: string;
  label?: string;
  name?: string;
  type?: 'text' | 'password' | 'search';
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  clearValue?: () => void;
  goToResetPassword?: () => void;
  value?: string;
  withShowPassword?: boolean;
  withResetPassword?: boolean;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  minLength?: number;
  maxLength?: number;
  error?: FieldError;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const type = props.type ?? 'text';
  const withShowPassword = props.withShowPassword ?? true;
  const withResetPassword = props.withResetPassword ?? false;
  const clearValue = props.clearValue ?? (() => null);
  const goToResetPassword = props.goToResetPassword ?? (() => null);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(
    () => setShowPassword((prevShowPassword) => !prevShowPassword),
    [showPassword]
  );

  return (
    <div className={classNames('relative', props.className)}>
      {props.label !== undefined ? (
        <label
          htmlFor={props.id}
          className={classNames(
            'font-poppins-bold text-[10px] uppercase text-black mb-[6px] ml-1 block',
            props.labelClassName
          )}
        >
          {props.label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {props.type === 'search' ? <SearchIcon className="w-6 absolute left-4" /> : null}
        {props.type === 'search' && props.value?.length ? (
          <XCircleIcon onClick={clearValue} className="w-6 absolute right-4 cursor-pointer" />
        ) : null}
        {withResetPassword ? (
          <a
            href="#"
            className="absolute bottom-full right-0 font-poppins-bold text-[10px] mb-1 mr-1 hover:underline focus:underline"
            onClick={(event) => {
              event.preventDefault();
              goToResetPassword();
            }}
          >
            Forgot password ?
          </a>
        ) : null}
        <input
          ref={ref}
          type={showPassword ? 'text' : type}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          minLength={props.minLength}
          className={classNames(
            'bg-gray-100 w-full h-[50px] with-ring rounded-button placeholder-gray-400 font-poppins-bold text-sm px-5',
            { 'pr-12': type === 'password' },
            { 'px-12': type === 'search' },
            props.inputClassName
          )}
          value={props.value}
          onChange={props.onChange}
        />
        {props.type === 'password' && withShowPassword ? (
          <span className="w-6 absolute right-4 cursor-pointer">
            {showPassword ? (
              <EyeOffIcon onClick={toggleShowPassword} />
            ) : (
              <EyeIcon onClick={toggleShowPassword} />
            )}
          </span>
        ) : null}
      </div>
      {/* TODO: show error */}
    </div>
  );
});

export default TextInput;