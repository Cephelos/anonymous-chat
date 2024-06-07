import { ChannelFilters, ChannelSort, StreamChat, Channel as StreamChannel, User } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useCreateChatClient,
  useChannelActionContext,
  useChannelStateContext
} from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import './layout.css';
import './utilityClasses.css';
import { useEffect, useState } from 'react';

const apiKey = 'tn7cufx4f5kq';
const userId = 'Cephelos';
const userName = 'Cephelos';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQ2VwaGVsb3MifQ.FFSiA4zWftX5Y83J2nC6klpoQo_5dbJcXxw4ey81RPw';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
};
const options = { presence: true, state: true };


init({ data });

const charToUnicode = (c: string) => {
  if (c && c.length !== 1) throw TypeError(`"${c}" is not a character`);
  const hex = c.codePointAt(0)!.toString(16);
  return "-u" + "0000".substring(0, 4 - hex.length) + hex + '-';

}

const App = () => {

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });


  const [channelName, setChannelName] = useState('');
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<StreamChannel | undefined>(undefined);

  useEffect(() => {
    if (!client) return;
    

    const fetchChannels = async () => {
      const channels = await client.queryChannels(filters, sort, options);
      setChannels(channels);
    };

    if (client) {
      fetchChannels();
    }
  }, [client]);

  const clearChannels = async () => {
    if (!client) return;
    const channels = await client.queryChannels(filters, sort, options);
    setActiveChannel(undefined);
    for (const channel of channels) {
      await channel.delete();
    }
  };

  const createChannel = async () => {
    if (!client) return;
    if (channelName.trim() === '') return;
    let channelId = channelName.replace(' ', '_')
    const nameRegEx = /[^\w!\n-]/;
    const invalidChars = channelId.match(nameRegEx);
    if (invalidChars) {
      for (const c of invalidChars) {
        channelId = channelId.replace(c, charToUnicode(c))
      }
      console.log(channelId)
    }
    const newChannel = client.channel('messaging', channelId, {
      name: channelName,
      members: [userId],
      });
      await newChannel.create();
      setChannelName('');
      setActiveChannel(newChannel);
      const updatedChannels = await client.queryChannels(filters, sort, options);
      setChannels(updatedChannels);
      await newChannel.sendMessage({ text: 'Hi! I\'d like to learn more information about your organization' });

  };

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={client} theme='str-chat__theme-custom'>
      <div className="channel-creation column-flex">
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Enter channel name"
        />
        <button onClick={createChannel}>Create Channel</button>
        <button onClick={clearChannels}>Clear Channels</button>
      </div>
      <ChannelList sort={sort} filters={filters} options={options} />
      <Channel channel={activeChannel} EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
    </Chat>
  );
};

export default App;
