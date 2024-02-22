import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socketClient } from '../features/socketClient';
import { toast } from 'react-toastify';
import ChatItem from '../components/ChatItem';
import {
  unsetIsLoading,
  asyncCreateMessage,
  socketGetMessages,
  socketGetMessage,
  socketUpdateMessage,
  socketDeleteMessage,
  asyncGetMessages,
} from '../features/Messages/MessagesSlice';
import { socketGetOnlineUsers } from '../features/OnlineUsers/OnlineUsersSlice';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import sendIcon from '../img/send-icon.png';
import heartIcon from '../img/bitting heart.gif';

function ChatList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.onlineUsers);
  const [content, setContent] = useState('');
  const socket = useRef(null);
  const chatListRef = useRef(null);

  const chatScrollDown = () => {
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  };

  useEffect(() => {
    if (socket.current === null && user && user.token) {
      // Connect to the server
      console.log(socket);
      socket.current = socketClient(user.token);
      // Get messages
      dispatch(asyncGetMessages(socket.current));
      // Listen for messages List
      socket.current.on('get-messages', (messages) => {
        dispatch(socketGetMessages(messages));
      });
      // Listen for new messages
      socket.current.on('new-message', (message) => {
        dispatch(socketGetMessage(message));
      });
      // Listen for message delete
      socket.current.on('delete-message', (message) => {
        dispatch(socketDeleteMessage(message));
      });
      // Listen for message update
      socket.current.on('update-message', (message) => {
        dispatch(socketUpdateMessage(message));
      });
      socket.current.on('online-users', (users) => {
        console.log('online users are: ', users);
        dispatch(socketGetOnlineUsers(users));
      });
      // Listen for errors
      socket.current.on('errorEvent', (error) => {
        dispatch(unsetIsLoading());
        toast.dismiss();
        toast.error(error.message);
      });
      socket.current.on('connect_error', (error) => {
        dispatch(unsetIsLoading());
        socket.current.emit('force-disconnect'); // Disconnect from the server
        toast.error(error.message, {
          toastId: 1,
        });
      });
    }
    return () => {
      if (socket.current) {
        console.log('exit chat list page');
        socket.current.disconnect(); // Disconnect from the server
        socket.current = null;
      }
    };
  }, [user, unsetIsLoading]);

  useEffect(() => {
    if (!isLoading) chatScrollDown();
  }, [messages, isLoading]);

  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('dark');
    return () => {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      dispatch(asyncCreateMessage({ socket: socket.current, content }))
        .unwrap()
        .catch((error) => {
          toast.error(
            'Error sending message: ' + error.message || 'Unknown error'
          );
        });
      setContent('');
    }
  };

  return (
    <div className='chat-list-page'>
      <div className='stats'>
        <input type='checkbox' />
        <div className='online-users-count'>
          <FaUser /> {onlineUsers.length}
        </div>
        {onlineUsers && (
          <div className='online-users-list'>
            <div className='headline'>
              <h3>Who is in here ?</h3>
              <div>
                <img src={heartIcon} className='icon' alt='' />
              </div>
            </div>
            <ul>
              {onlineUsers.map((user) => (
                <li key={user._id}>
                  <div
                    className={`online-users-avatar`}
                    style={{
                      backgroundImage:
                        user.gravatarUrl && `url(${user.gravatarUrl}`,
                    }}
                  ></div>
                  <p>{user.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='list-items' ref={chatListRef}>
        {messages.map((message) => (
          <ChatItem
            key={message._id}
            socket={socket.current}
            message={message}
          />
        ))}
        {isLoading && <Spinner />}
      </div>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group new-message-input'>
          <textarea
            className='form-control'
            placeholder='Type your message here'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          className='btn btn-transperent send-message-button'
          type='submit'
        >
          <img className='send-icon' src={sendIcon} alt='send' />
        </button>
      </form>
    </div>
  );
}

export default ChatList;
