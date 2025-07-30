import { FC, useState, useEffect, lazy } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import socket from '../services/socket';
import roomSetup from '../services/roomSetup';
import { useNavigate } from 'react-router-dom';
import { SolutionResult } from '../services/roomSetup';
import handlers from '../handlers/roomPageHandlers';
import getToken from '../api/auth/getToken';
import getCurrentCode from '../api/room/getCurrentCode';
import getQuestion from '../api/room/getQuestion';
import checkIfRoomHasPassword from '../api/room/checkIfRoomHasPassword';
import checkIfUserIsInRoom from '../api/room/checkIfUserIsInRoom';
const Editor = lazy(() => import('@monaco-editor/react'));

const LANGUAGES = {
    python: { id: 71, name: 'Python', monaco: 'python' },
    javascript: { id: 63, name: 'JavaScript', monaco: 'javascript' }
};

export type LanguageName = keyof typeof LANGUAGES;

const Room: FC = () => {
    const defaultLang = Object.keys(LANGUAGES)[0] as LanguageName;
    const urlparams = new URLSearchParams(window.location.search);
    const roomId = urlparams.get('roomId');
    const navigate = useNavigate();
    if (!roomId) {
        // TODO: Add message to user about missing room ID
        navigate('/dashboard');
        return;
    }

    const [users, setUsers] = useState<string[]>([]);
    const [usersOpen, setUsersOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [code, setCode] = useState<string>('# Write your code here');
    const [output, setOutput] = useState<SolutionResult[] | string>([]);
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageName>(defaultLang);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [problemStatement, setProblemStatement] = useState<string>(
        'Waiting for game to start...'
    );
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [readyButton, setReadyButton] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false); // Default: cannot submit
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { inRoom, roomId: userRoomId } =
                    await checkIfUserIsInRoom();
                let passwordArg: string | undefined;
                // If user not in this room, check for password requirement
                if (!inRoom || userRoomId !== roomId) {
                    const hasPassword = await checkIfRoomHasPassword(roomId);
                    if (hasPassword) {
                        const pwd = prompt('Enter room password:');
                        if (!pwd) {
                            console.warn(
                                'No password entered, aborting room join'
                            );
                            return;
                        }
                        passwordArg = pwd;
                    }
                }
                // Proceed with room setup, passing passwordArg if defined
                roomSetup(
                    roomId,
                    setOutput,
                    setIsRunning,
                    setReadyButton,
                    navigate,
                    passwordArg
                );
            } catch (error) {
                console.error('Error during room setup:', error);
                navigate('/dashboard');
            }
        })();
        socket.off('start_game');
        socket.off('rejoin_game');
        socket.on('start_game', (question) => {
            console.log('Game started:', question);
            setProblemStatement(question.question);
            setCode(question.startingCode);
            setCanSubmit(true); // Enable submit button when game starts
        });
        socket.on('rejoin_game', (question) => {
            setProblemStatement(question.question);
            setCanSubmit(true); // Enable submit button when rejoining
        });
        getToken()
            .then((fetchedToken) => {
                setToken(fetchedToken);
            })
            .catch((error) => {
                console.error('Error fetching token:', error);
                navigate('/login');
            });
        getCurrentCode(roomId)
            .then((currentCode) => {
                setCode(currentCode.code);
            })
            .catch((error) => {
                console.error('Error fetching current code:', error);
            });
        // Check that the problem statement is set correctly
        if (problemStatement === 'Waiting for game to start...') {
            getQuestion(roomId)
                .then((question) => {
                    setProblemStatement(question.question);
                })
                .catch((error) => {
                    if (error.response && error.response.status !== 403) {
                        console.error('Error fetching question:', error);
                        setProblemStatement(
                            'Error loading question. Please try again later.'
                        );
                    }
                });
        }
    }, []);

    return (
        <>
            <Snackbar
                open={isSaving}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity='info' sx={{ width: '100%' }}>
                    Saving code...
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    display: 'flex',
                    height: 'calc(100vh - 64px)',
                    p: 2,
                    gap: 2
                }}
            >
                {/* Collapsible Users Menu (Left) */}
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
                            handlers.handleOpenUsers(
                                roomId,
                                setUsers,
                                setUsersOpen
                            )
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
                                <Typography variant='body2'>
                                    No users
                                </Typography>
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
                {/* Main Content */}
                <Box
                    sx={{
                        flex: 1.2,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}
                    >
                        <Typography variant='h6'>Code Editor</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant='outlined'
                                color='primary'
                                sx={{ ml: 2 }}
                                onClick={() =>
                                    handlers.handleCopyRoomId(roomId, setCopied)
                                }
                                disabled={!roomId}
                            >
                                {copied ? 'Copied!' : 'Copy Room ID'}
                            </Button>
                            <FormControl size='small' sx={{ minWidth: 120 }}>
                                <InputLabel id='language-select-label'>
                                    Language
                                </InputLabel>
                                <Select
                                    labelId='language-select-label'
                                    value={selectedLanguage}
                                    label='Language'
                                    onChange={(event) =>
                                        handlers.handleLanguageChange(
                                            event,
                                            selectedLanguage,
                                            setSelectedLanguage,
                                            code,
                                            setCode
                                        )
                                    }
                                >
                                    {Object.entries(LANGUAGES).map(
                                        ([name, _langData]) => (
                                            <MenuItem key={name} value={name}>
                                                {name.charAt(0).toUpperCase() +
                                                    name.slice(1)}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                            </FormControl>
                            <Button
                                variant='contained'
                                color='error'
                                startIcon={<ExitToAppIcon />}
                                onClick={() => {
                                    if (!token) {
                                        console.error('No token available');
                                        return;
                                    }
                                    handlers.handleLeaveRoom(
                                        roomId,
                                        navigate,
                                        token
                                    );
                                }}
                                sx={{ ml: 2 }}
                            >
                                Leave Room
                            </Button>
                            {readyButton && (
                                <Button
                                    variant='outlined'
                                    color='success'
                                    sx={{ ml: 2 }}
                                    onClick={() => {
                                        if (!token) {
                                            console.error('No token available');
                                            return;
                                        }
                                        handlers.handleReadyButton(
                                            roomId,
                                            setReadyButton,
                                            token
                                        );
                                    }}
                                >
                                    Ready
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            border: '1px solid grey',
                            mb: 1,
                            minHeight: '300px'
                        }}
                    >
                        <Editor
                            height='100%'
                            language={LANGUAGES[selectedLanguage].monaco}
                            value={code}
                            onChange={(value) => {
                                if (!token) {
                                    console.error('No token available');
                                    return;
                                }
                                handlers.handleEditorChange(
                                    value,
                                    setCode,
                                    setIsSaving,
                                    roomId,
                                    token
                                );
                            }}
                            theme='vs-dark'
                            options={{
                                minimap: { enabled: false },
                                readOnly: !canSubmit
                            }}
                        />
                    </Box>
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (!token) {
                                console.error('No token available');
                                return;
                            }
                            handlers.handleSubmitCode(
                                setIsRunning,
                                setOutput,
                                setActiveTab,
                                roomId,
                                code,
                                token
                            );
                        }}
                        disabled={isRunning || !canSubmit}
                    >
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, newValue) => setActiveTab(newValue)}
                            aria-label='statement and output tabs'
                        >
                            <Tab
                                label='Statement'
                                id='tab-statement'
                                aria-controls='tabpanel-statement'
                            />
                            <Tab
                                label='Output'
                                id='tab-output'
                                aria-controls='tabpanel-output'
                            />
                        </Tabs>
                    </Box>
                    <Paper
                        elevation={2}
                        sx={{
                            flexGrow: 1,
                            p: 2,
                            backgroundColor: '#1e1e1e',
                            color: 'white',
                            overflowY: 'auto',
                            mt: 0,
                            minHeight: '300px',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        <div
                            role='tabpanel'
                            hidden={activeTab !== 0}
                            id='tabpanel-statement'
                            aria-labelledby='tab-statement'
                        >
                            {activeTab === 0 && (
                                <Typography
                                    variant='body1'
                                    component='pre'
                                    sx={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {problemStatement}
                                </Typography>
                            )}
                        </div>
                        <div
                            role='tabpanel'
                            hidden={activeTab !== 1}
                            id='tabpanel-output'
                            aria-labelledby='tab-output'
                        >
                            {activeTab === 1 && (
                                <Typography
                                    variant='body2'
                                    component='pre'
                                    sx={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {output === 'Running...' ? (
                                        <span>Running...</span>
                                    ) : Array.isArray(output) ? (
                                        output.map((result, index) => {
                                            const statusId =
                                                result.result.status_id;
                                            const stdout = result.result.stdout
                                                ? atob(result.result.stdout)
                                                : '';
                                            const stderr = result.result.stderr
                                                ? atob(result.result.stderr)
                                                : '';
                                            const compileOutput = result.result
                                                .compile_output
                                                ? atob(
                                                      result.result
                                                          .compile_output
                                                  )
                                                : '';
                                            const message = result.result
                                                .message
                                                ? atob(result.result.message)
                                                : '';
                                            const expected =
                                                result.expectedOutput;
                                            let verdict = '';
                                            let verdictColor = '';
                                            if (statusId === 3) {
                                                verdict = 'Correct';
                                                verdictColor = 'green';
                                            } else if (statusId === 4) {
                                                verdict = 'Incorrect';
                                                verdictColor = 'orange';
                                            } else if (statusId > 4) {
                                                verdict = 'Error';
                                                verdictColor = 'red';
                                            }
                                            return (
                                                <Accordion
                                                    key={index}
                                                    sx={{
                                                        background: '#23272f',
                                                        color: 'white',
                                                        mb: 1
                                                    }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon
                                                                sx={{
                                                                    color: 'white'
                                                                }}
                                                            />
                                                        }
                                                        aria-controls={`panel${index}-content`}
                                                        id={`panel${index}-header`}
                                                    >
                                                        <strong>
                                                            Test Case{' '}
                                                            {index + 1}:
                                                        </strong>
                                                        <span
                                                            style={{
                                                                color: verdictColor,
                                                                fontWeight:
                                                                    'bold',
                                                                marginLeft: 12
                                                            }}
                                                        >
                                                            {verdict}
                                                        </span>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <div
                                                            style={{
                                                                marginBottom: 8
                                                            }}
                                                        >
                                                            <strong>
                                                                Input:
                                                            </strong>
                                                            <pre
                                                                style={{
                                                                    background:
                                                                        '#181c23',
                                                                    padding: 8,
                                                                    borderRadius: 4
                                                                }}
                                                            >
                                                                {
                                                                    result.testCase
                                                                }
                                                            </pre>
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginBottom: 8
                                                            }}
                                                        >
                                                            <strong>
                                                                Expected Output:
                                                            </strong>
                                                            <pre
                                                                style={{
                                                                    background:
                                                                        '#181c23',
                                                                    padding: 8,
                                                                    borderRadius: 4
                                                                }}
                                                            >
                                                                {expected}
                                                            </pre>
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginBottom: 8
                                                            }}
                                                        >
                                                            <strong>
                                                                Your Output:
                                                            </strong>
                                                            <pre
                                                                style={{
                                                                    background:
                                                                        '#181c23',
                                                                    padding: 8,
                                                                    borderRadius: 4
                                                                }}
                                                            >
                                                                {stdout}
                                                            </pre>
                                                        </div>
                                                        {statusId > 4 && (
                                                            <>
                                                                {stderr && (
                                                                    <div>
                                                                        <strong>
                                                                            Stderr:
                                                                        </strong>
                                                                        <pre
                                                                            style={{
                                                                                background:
                                                                                    '#181c23',
                                                                                padding: 8,
                                                                                borderRadius: 4
                                                                            }}
                                                                        >
                                                                            {
                                                                                stderr
                                                                            }
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {compileOutput && (
                                                                    <div>
                                                                        <strong>
                                                                            Compile
                                                                            Output:
                                                                        </strong>
                                                                        <pre
                                                                            style={{
                                                                                background:
                                                                                    '#181c23',
                                                                                padding: 8,
                                                                                borderRadius: 4
                                                                            }}
                                                                        >
                                                                            {
                                                                                compileOutput
                                                                            }
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {message && (
                                                                    <div>
                                                                        <strong>
                                                                            Message:
                                                                        </strong>
                                                                        <pre
                                                                            style={{
                                                                                background:
                                                                                    '#181c23',
                                                                                padding: 8,
                                                                                borderRadius: 4
                                                                            }}
                                                                        >
                                                                            {
                                                                                message
                                                                            }
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </AccordionDetails>
                                                </Accordion>
                                            );
                                        })
                                    ) : (
                                        <span>{output}</span>
                                    )}
                                </Typography>
                            )}
                        </div>
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default Room;
