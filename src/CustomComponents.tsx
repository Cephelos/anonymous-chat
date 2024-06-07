import React, { useRef } from 'react';
import clsx from 'clsx';


const UnMemoizedCreateNewChatButton = (
  props: { active: boolean; orgName?: "" | undefined; },
) => {
  const {
    active,
    orgName = ""
} = props;

  const createNewChatButton = useRef<HTMLButtonElement | null>(null);

  const onPressButton = (e: React.MouseEvent<HTMLButtonElement>) => {

  };

  return (
    <button
      aria-label={"Chat Anonymously Now"}
      aria-selected={active}
      className={clsx(
        `str-chat__channel-preview-messenger str-chat__channel-preview`,
        active && 'str-chat__channel-preview-messenger--active',
        unread && unread >= 1 && 'str-chat__channel-preview-messenger--unread',
        customClassName,
      )}
      data-testid='channel-preview-button'
      onClick={onPressButton}
      ref={createNewChatButton}
      role='option'
    >
      <div className='str-chat__channel-preview-messenger--left'>
        <Avatar
          className='str-chat__avatar--channel-preview'
          image={displayImage}
          name={avatarName}
        />
      </div>
      <div className='str-chat__channel-preview-end'>
        <div className='str-chat__channel-preview-end-first-row'>
          <div className='str-chat__channel-preview-messenger--name'>
            <span>{displayTitle}</span>
          </div>
          {!!unread && (
            <div className='str-chat__channel-preview-unread-badge' data-testid='unread-badge'>
              {unread}
            </div>
          )}
        </div>
        <div className='str-chat__channel-preview-messenger--last-message'>{latestMessage}</div>
      </div>
    </button>
  );
};

/**
 * Used as preview component for channel item in [ChannelList](#channellist) component.
 * Its best suited for messenger type chat.
 */
export const CreateNewChatButton = React.memo(
  UnMemoizedCreateNewChatButton,
) as typeof UnMemoizedCreateNewChatButton;