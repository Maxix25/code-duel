import { FC, useState, SyntheticEvent } from 'react';
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
} from '@mui/material';
import runCode from '../api/compiler/runCode';
import { LANGUAGES } from '../api/compiler';

type LanguageName = keyof typeof LANGUAGES;

const Room: FC = () => {
    const defaultLang = Object.keys(LANGUAGES)[0] as LanguageName;
    const [code, setCode] = useState<string>('# Write your code here');
    const [output, setOutput] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageName>(defaultLang);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [problemStatement, setProblemStatement] = useState<string>(
        'Problem statement goes here...'
    );
    const [isRunning, setIsRunning] = useState<boolean>(false);

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

        runCode(code, selectedLanguage)
            .then((data) => {
                console.log('Code execution result:', data);
                let resultOutput = '';
                if (data.status.description === 'Accepted') {
                    resultOutput =
                        data.stdout || 'Execution completed with no output.';
                } else {
                    resultOutput = `Error (${data.status.description}):\n${
                        data.stderr ||
                        data.compile_output ||
                        data.message ||
                        'Unknown error.'
                    }`;
                }
                setOutput(resultOutput);
            })
            .catch((error) => {
                console.error('Error running code:', error);
                setOutput(`Error running code: ${error.message}`);
            })
            .finally(() => {
                setIsRunning(false);
            });
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
                        options={{ minimap: { enabled: false } }}
                    />
                </Box>
                <Button
                    variant='contained'
                    onClick={handleSubmitCode}
                    disabled={isRunning}
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
                                {output || 'Output will appear here...'}
                            </Typography>
                        )}
                    </div>
                </Paper>
            </Box>
        </Box>
    );
};

export default Room;
