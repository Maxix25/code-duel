import { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import handlers from '../handlers/roomPageHandlers';

interface UsersPanelProps {
    roomId: string;
}

const UsersPanel: FC<UsersPanelProps> = ({ roomId }) => {
    const [usersOpen, setUsersOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<string[]>([]);
    return (
        <Box
            sx={{
                width: usersOpen ? 220 : 48,
                transition: 'width 0.2s',
                background: '#23272f',
                color: 'white',
                borderRadius: 2,
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                pt: 2,
                minHeight: '300px'
            }}
        >
            <Button
                variant='text'
                sx={{ minWidth: 0, color: 'white', mb: 1, ml: 1 }}
                onClick={() =>
                    handlers.handleOpenUsers(roomId, setUsers, setUsersOpen)
                }
            >
                {usersOpen ? '<' : '>'}
            </Button>
            {usersOpen && (
                <Box sx={{ pl: 2, pr: 2, width: '100%' }}>
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>
                        Users in Room
                    </Typography>
                    {users.length === 0 ? (
                        <Typography variant='body2'>No users</Typography>
                    ) : (
                        users.map((user, idx) => (
                            <Typography
                                key={idx}
                                variant='body2'
                                sx={{ mb: 0.5 }}
                            >
                                {user}
                            </Typography>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
};

export default UsersPanel;
