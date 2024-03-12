import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socketClient } from '../features/socketClient';
import { toast } from 'react-toastify';
import ChatItem from '../components/ChatItem';
import {
  unsetIsLoading,
  asyncCreateMessage,
  asyncSendFeedback,
  socketGetMessages,
  socketGetMessage,
  socketUpdateMessage,
  socketDeleteMessage,
  asyncGetMessages,
  socketGetFeedback,
  clearFeedback,
} from '../features/Messages/MessagesSlice';
import { socketGetOnlineUsers } from '../features/OnlineUsers/OnlineUsersSlice';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import sendIcon from '../img/send-icon.png';
import heartIcon from '../img/bitting heart.gif';
import BackgroundSong from '../img/Gregory-Alan-Isakov-Words.mp3';
import RadioImg from '../img/radio-image.png';

function ChatList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading, feedback } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.onlineUsers);
  const [content, setContent] = useState('');
  const [radionOnOff, setRadionOnOff] = useState(false);
  const socket = useRef(null);
  const chatListRef = useRef(null);
  const audioElement = useRef(null);
  const timeOutRef = useRef(null);

  const chatScrollDown = () => {
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  };

  useEffect(() => {
    if (socket.current === null && user && user.token) {
      // Connect to the server
      socket.current = socketClient(user.token);
      // Clear feedbacl
      dispatch(clearFeedback());
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
      socket.current.on('feedback', (message) => {
        dispatch(socketGetFeedback(message));
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
          dispatch(clearFeedback(message));
        }, 3000);
      });
      document
        .getElementsByClassName('new-message-input')[0]
        .addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementsByClassName('send-message-button')[0].click();
          } else
            dispatch(
              asyncSendFeedback({
                socket: socket.current,
                message: `${user.name} is typing...`,
              })
            );
        });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect(); // Disconnect from the server
        socket.current = null;
      }
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (!isLoading) chatScrollDown();
  }, [messages, isLoading, feedback]);

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

  const handleRadioClick = async (on) => {
    if (audioElement.current === null) {
      audioElement.current = new Audio(BackgroundSong);
      audioElement.current.onpause = function () {
        setRadionOnOff(false);
      };
    }
    if (!on) {
      await audioElement.current.play();
    } else {
      await audioElement.current.pause();
    }
    setRadionOnOff(!on);
  };

  return (
    <div className='chat-list-page'>
      <div className='info'>
        <div className='stats'>
          <input type='checkbox' />
          <div className='online-users-count'>
            <FaUser /> {onlineUsers.length}
          </div>
          {onlineUsers && (
            <div className='online-users-list'>
              <div className='headline'>
                <h3>Who is in here ?</h3>
                <div className='icon'>
                  <img src={heartIcon} alt='' />
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
        <div
          className={`radio ${!radionOnOff ? 'mid-opacity' : 'radio-on'}`}
          onClick={() => handleRadioClick(radionOnOff)}
        >
          <img src={RadioImg} alt='Click for sound' />
        </div>
      </div>
      <div className='list-items' ref={chatListRef}>
        {messages.map((message) => (
          <ChatItem
            key={message._id}
            socket={socket.current}
            message={message}
          />
        ))}
        <p className='feedback'>{`${feedback}`}</p>
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
