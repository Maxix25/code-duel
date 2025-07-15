import { FC, useState, SyntheticEvent, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
    SelectChangeEvent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import socket from '../services/socket';
import roomSetup from '../services/roomSetup';
import { useNavigate } from 'react-router-dom';
import { SolutionResult } from '../services/roomSetup';

const LANGUAGES = {
    python: { id: 71, name: 'Python', monaco: 'python' },
    javascript: { id: 63, name: 'JavaScript', monaco: 'javascript' },
};

type LanguageName = keyof typeof LANGUAGES;

const Room: FC = () => {
    const defaultLang = Object.keys(LANGUAGES)[0] as LanguageName;
    const urlparams = new URLSearchParams(window.location.search);
    const roomId = urlparams.get('roomId');
    const [code, setCode] = useState<string>('# Write your code here');
    const [output, setOutput] = useState<SolutionResult[] | string>([]);
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageName>(defaultLang);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [problemStatement, setProblemStatement] = useState<string>(
        'Waiting for game to start...'
    );
    const navigate = useNavigate();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [readyButton, setReadyButton] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false); // Default: cannot submit

    useEffect(() => {
        if (!roomId) {
            // TODO: Add message to user about missing room ID
            navigate('/dashboard');
            return;
        }
        roomSetup(roomId, setOutput, setIsRunning, setReadyButton, navigate);
        socket.on('start_game', (question) => {
            console.log('Game started:', question);
            setProblemStatement(question.question);
            setCode(question.startingCode);
            setCanSubmit(true); // Enable submit button when game starts
        });
    }, []);
    // Helper: get default comment for each language
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

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    const handleLanguageChange = (event: SelectChangeEvent<LanguageName>) => {
        const lang = event.target.value as LanguageName;
        setSelectedLanguage(lang);
        // Only set default comment if code is empty or is the previous default
        if (
            code.trim() === '' ||
            code === getDefaultComment(selectedLanguage)
        ) {
            setCode(getDefaultComment(lang));
        }
    };

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSubmitCode = () => {
        setIsRunning(true);
        setOutput('Running...');
        setActiveTab(1);
        socket.emit('submit_solution', {
            roomId,
            code,
            user_token: localStorage.getItem('token'),
        });
    };

    const handleLeaveRoom = () => {
        socket.emit('leave_room', {
            roomId,
            user_token: localStorage.getItem('token'),
        });
        socket.disconnect();
        navigate('/dashboard');
    };
    const handleReadyButton = () => {
        socket.emit('player_ready', {
            roomId,
            user_token: localStorage.getItem('token'),
        });
        setReadyButton(false); // Hide the button after clicking
    };

    return (
        <Box
            sx={{ display: 'flex', height: 'calc(100vh - 64px)', p: 2, gap: 2 }}
        >
            <Box
                sx={{
                    flex: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <Typography variant='h6'>Code Editor</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size='small' sx={{ minWidth: 120 }}>
                            <InputLabel id='language-select-label'>
                                Language
                            </InputLabel>
                            <Select
                                labelId='language-select-label'
                                value={selectedLanguage}
                                label='Language'
                                onChange={handleLanguageChange}
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
                            onClick={handleLeaveRoom}
                            sx={{ ml: 2 }}
                        >
                            Leave Room
                        </Button>
                        {readyButton && (
                            <Button
                                variant='outlined'
                                color='success'
                                sx={{ ml: 2 }}
                                onClick={handleReadyButton}
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
                        minHeight: '300px',
                    }}
                >
                    <Editor
                        height='100%'
                        language={LANGUAGES[selectedLanguage].monaco}
                        value={code}
                        onChange={handleEditorChange}
                        theme='vs-dark'
                        options={{
                            minimap: { enabled: false },
                            readOnly: !canSubmit,
                        }}
                    />
                </Box>
                <Button
                    variant='contained'
                    onClick={handleSubmitCode}
                    disabled={isRunning || !canSubmit}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
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
                        whiteSpace: 'pre-wrap',
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
                                            ? atob(result.result.compile_output)
                                            : '';
                                        const message = result.result.message
                                            ? atob(result.result.message)
                                            : '';
                                        const expected = result.expectedOutput;
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
                                                    mb: 1,
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <ExpandMoreIcon
                                                            sx={{
                                                                color: 'white',
                                                            }}
                                                        />
                                                    }
                                                    aria-controls={`panel${index}-content`}
                                                    id={`panel${index}-header`}
                                                >
                                                    <strong>
                                                        Test Case {index + 1}:
                                                    </strong>
                                                    <span
                                                        style={{
                                                            color: verdictColor,
                                                            fontWeight: 'bold',
                                                            marginLeft: 12,
                                                        }}
                                                    >
                                                        {verdict}
                                                    </span>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div
                                                        style={{
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        <strong>Input:</strong>
                                                        <pre
                                                            style={{
                                                                background:
                                                                    '#181c23',
                                                                padding: 8,
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            {result.testCase}
                                                        </pre>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginBottom: 8,
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
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            {expected}
                                                        </pre>
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginBottom: 8,
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
                                                                borderRadius: 4,
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
                                                                            borderRadius: 4,
                                                                        }}
                                                                    >
                                                                        {stderr}
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
                                                                            borderRadius: 4,
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
                                                                            borderRadius: 4,
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
    );
};

export default Room;
