import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

interface TagProps {
  text: string;
  onClick?: () => void;
  isColored?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  className?: string;
  disabled?: boolean;
}

const Tag: React.FC<TagProps> = React.memo((props) => {
  const isClosable = props.isClosable ?? false;
  const onClose = props.onClose ?? (() => null);
  const isColored = props.isColored ?? false;
  const disabled = props.disabled ?? false;

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={disabled}
      className={classNames(
        'rounded-tag py-[7px] px-[10px] inline-flex uppercase',
        isColored ? 'bg-primary text-black' : 'bg-gray-400/40 text-black',
        {
          'cursor-default': props.onClick === undefined,
          'with-ring': props.onClick !== undefined,
        },
        props.className
      )}
    >
      <span className="font-poppins-bold text-[10px] leading-[15px]">#{props.text}</span>
      {isClosable ? (
        <XIcon
          className="w-[14px] ml-[6px] cursor-pointer rounded-sm"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        />
      ) : null}
    </button>
  );
});

export default Tag;
