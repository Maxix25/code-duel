import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import { LanguageName } from '../pages/RoomPage';
import socket from '../services/socket';
import { NavigateFunction } from 'react-router-dom';
import getUsersInRoom from '../api/room/getUsersInRoom';
import { SolutionResult } from '../services/roomSetup';

let saveTimeout: NodeJS.Timeout | null = null;

const getDefaultComment = (lang: LanguageName) => {
    switch (lang) {
        case 'python':
            return '# Write your code here';
        case 'javascript':
            return '// Write your code here';
        // Add more languages as needed
        default:
            return '// Write your code here';
    }
};

const handleEditorChange = (
    value: string | undefined,
    setCode: React.Dispatch<React.SetStateAction<string>>,
    roomId: string,
    token: string
) => {
    const newCode = value || '';
    setCode(newCode);

    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    if (roomId) {
        saveTimeout = setTimeout(async () => {
            socket.emit('code_save', {
                roomId,
                code: newCode,
                user_token: token
            });
        }, 2000);
    }
};

const handleLanguageChange = (
    event: SelectChangeEvent<LanguageName>,
    selectedLanguage: LanguageName,
    setSelectedLanguage: React.Dispatch<React.SetStateAction<LanguageName>>,
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>
) => {
    const lang = event.target.value as LanguageName;
    setSelectedLanguage(lang);
    // Only set default comment if code is empty or is the previous default
    if (code.trim() === '' || code === getDefaultComment(selectedLanguage)) {
        setCode(getDefaultComment(lang));
    }
};

const handleSubmitCode = (
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>,
    setOutput: React.Dispatch<React.SetStateAction<string | SolutionResult[]>>,
    setActiveTab: React.Dispatch<React.SetStateAction<number>>,
    roomId: string,
    code: string,
    token: string
) => {
    setIsRunning(true);
    setOutput('Running...');
    setActiveTab(1);
    socket.emit('submit_solution', {
        roomId,
        code,
        user_token: token
    });
};

const handleLeaveRoom = (
    roomId: string | null,
    navigate: NavigateFunction,
    token: string
) => {
    socket.emit('leave_room', {
        roomId,
        user_token: token
    });
    socket.disconnect();
    navigate('/dashboard');
};
const handleReadyButton = (
    roomId: string,
    setReadyButton: React.Dispatch<React.SetStateAction<boolean>>,
    token: string
) => {
    socket.emit('player_ready', {
        roomId,
        user_token: token
    });
    setReadyButton(false); // Hide the button after clicking
};
const handleOpenUsers = async (
    roomId: string,
    setUsers: React.Dispatch<React.SetStateAction<string[]>>,
    setUsersOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (roomId) {
        const usersInRoom = await getUsersInRoom(roomId);
        setUsers(usersInRoom);
        setUsersOpen((open) => !open);
    }
};
const handleCopyRoomId = (
    roomId: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (roomId) {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }
};

export default {
    handleCopyRoomId,
    handleOpenUsers,
    handleReadyButton,
    handleLeaveRoom,
    handleSubmitCode,
    handleLanguageChange,
    handleEditorChange
};
