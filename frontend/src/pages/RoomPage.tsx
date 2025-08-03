import { FC, useState, useEffect, lazy } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import socket from '../services/socket';
import roomSetup from '../services/roomSetup';
import { useNavigate } from 'react-router-dom';
import { SolutionResult } from '../services/roomSetup';
import getToken from '../api/auth/getToken';
import getCurrentCode from '../api/room/getCurrentCode';
import getQuestion from '../api/room/getQuestion';
import checkIfRoomHasPassword from '../api/room/checkIfRoomHasPassword';
import checkIfUserIsInRoom from '../api/room/checkIfUserIsInRoom';
import UsersPanel from '../components/UsersPanel';
const CodeEditor = lazy(() => import('../components/CodeEditor'));

const Room: FC = () => {
    const urlparams = new URLSearchParams(window.location.search);
    const roomId = urlparams.get('roomId');
    const navigate = useNavigate();
    const [code, setCode] = useState<string>('# Write your code here');
    const [output, setOutput] = useState<SolutionResult[] | string>([]);

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
                // If user not in this room, check for password requirement
                if (!inRoom || userRoomId !== roomId) {
                    const hasPassword = await checkIfRoomHasPassword(roomId);
                    if (hasPassword) {
                        navigate(`/enter-password?roomId=${roomId}`);
                        return;
                    }
                }
                roomSetup(
                    roomId!,
                    setOutput,
                    setIsRunning,
                    setReadyButton,
                    navigate
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
            console.log('Rejoined game');
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
        getCurrentCode(roomId!)
            .then((currentCode) => {
                setCode(currentCode.code);
            })
            .catch((error) => {
                console.error('Error fetching current code:', error);
            });
        // Check that the problem statement is set correctly
        if (problemStatement === 'Waiting for game to start...') {
            getQuestion(roomId!)
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
        return () => {
            socket.disconnect();
        };
    }, [navigate, problemStatement, roomId]);
    if (!roomId) {
        // TODO: Add message to user about missing room ID
        navigate('/dashboard');
        return;
    }

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
                <UsersPanel roomId={roomId || ''} />
                {/* Main Content */}
                <CodeEditor
                    roomId={roomId}
                    code={code}
                    setCode={setCode}
                    token={token}
                    readyButton={readyButton}
                    setReadyButton={setReadyButton}
                    canSubmit={canSubmit}
                    setIsSaving={setIsSaving}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    setOutput={setOutput}
                    setActiveTab={setActiveTab}
                />

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
