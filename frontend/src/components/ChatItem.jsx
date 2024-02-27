import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncDeleteMessage,
  asyncUpdateMessage,
} from '../features/Messages/MessagesSlice';
import { toast } from 'react-toastify';
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaPen,
  FaTrash,
} from 'react-icons/fa';
import moment from 'moment';

function ChatItem({ socket, message }) {
  const dispatch = useDispatch();
  const { users, user } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = React.useState(false);
  const [updatedContent, setUpdatedContent] = React.useState(message.content);
  const userType = user._id === message.user ? 'self' : 'other';
  const inputRef = useRef(null);

  useEffect(() => {
    if (editMode === true) {
      setUpdatedContent(message.content);
      inputRef.current.focus();
    }
  }, [editMode]);

  const deleteMessage = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(asyncDeleteMessage({ socket, id: message._id }))
        .unwrap()
        .then(() => {
          toast.success('Message deleted successfully');
        })
        .catch((error) => {
          toast.error(
            'Error deleting message: ' + error.message || 'Unknown error'
          );
        });
    }
  };

  const updateMessage = (updatedContent) => {
    dispatch(
      asyncUpdateMessage({
        socket,
        id: message._id,
        content: updatedContent,
      })
    )
      .unwrap()
      .then(() => {
        setEditMode(false);
        toast.success('Message updated successfully');
      })
      .catch((error) => {
        toast.error(
          'Error updating message: ' + error.message || 'Unknown error'
        );
      });
  };

  const editModeHandler = () => {
    if (editMode === false) {
      setEditMode(true);
    } else {
      setEditMode(false);
      setUpdatedContent(message.content);
    }
  };

  const calculateTime = (timeString) => {
    let time = moment(timeString);
    if (moment().diff(time, 'minute') > 60) {
      return time.format('MMM D, h:mm a');
    }
    return time.fromNow();
  };

  return (
    <div className={`list-item-container ${userType}`}>
      <div
        className={`list-avatar ${userType}`}
        style={{
          backgroundImage: message.gravatarUrl && `url(${message.gravatarUrl}`,
        }}
      ></div>
      <div className={`list-item ${userType}-content`}>
        {userType === 'self' && (
          <div className='list-item-change-buttons'>
            <button
              className='delete btn btn-transperent'
              onClick={deleteMessage}
            >
              <FaTrash size={20} />
            </button>
            <button
              className='edit btn btn-transperent'
              onClick={editModeHandler}
            >
              <FaPen />
            </button>
          </div>
        )}
        <h3>{message.userName}</h3>
        <p className='time'>{calculateTime(message.createdAt)}</p>
        {editMode ? (
          <div className='edit-mode'>
            <div className='form-group list-item-edit-input'>
              <textarea
                ref={inputRef}
                className='edit-input'
                type='text'
                name='updatedContent'
                id='updatedContent'
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
              ></textarea>
            </div>
            <div className='form-group list-item-edit-buttons'>
              <button
                className='btn'
                onClick={() => updateMessage(updatedContent)}
              >
                <FaCheckCircle />
              </button>
            </div>
            {/* <div className='form-group list-item-edit-buttons'>
              <button className='btn' onClick={() => setEditMode(false)}>
                <FaArrowAltCircleLeft />
              </button>
            </div> */}
          </div>
        ) : (
          <div className='form-group'>
            <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
