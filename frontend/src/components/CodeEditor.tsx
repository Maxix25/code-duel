import { FC, Dispatch, SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { SolutionResult } from '../services/roomSetup';
import handlers from '../handlers/roomPageHandlers';
import CodeMirror, {
    oneDark,
    EditorView,
    EditorState
} from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';

const LANGUAGES = {
    python: { id: 71, name: 'Python', codemirror: python() },
    javascript: { id: 63, name: 'JavaScript', codemirror: javascript() }
};

export type LanguageName = keyof typeof LANGUAGES;

interface CodeEditorProps {
    roomId: string;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
    token: string | null;
    readyButton: boolean;
    setReadyButton: Dispatch<SetStateAction<boolean>>;
    canSubmit: boolean;
    setIsSaving: Dispatch<SetStateAction<boolean>>;
    isRunning: boolean;
    setIsRunning: Dispatch<SetStateAction<boolean>>;
    setOutput: Dispatch<SetStateAction<SolutionResult[] | string>>;
    setActiveTab: Dispatch<SetStateAction<number>>;
}

const CodeEditor: FC<CodeEditorProps> = ({
    roomId,
    code,
    setCode,
    token,
    readyButton,
    setReadyButton,
    canSubmit,
    setIsSaving,
    isRunning,
    setIsRunning,
    setOutput,
    setActiveTab
}) => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageName>('python');
    const [copied, setCopied] = useState<boolean>(false);

    return (
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
                            {Object.entries(LANGUAGES).map(([name]) => (
                                <MenuItem key={name} value={name}>
                                    {name.charAt(0).toUpperCase() +
                                        name.slice(1)}
                                </MenuItem>
                            ))}
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
                            handlers.handleLeaveRoom(roomId, navigate, token);
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
                <CodeMirror
                    height='100%'
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
                    extensions={[
                        EditorView.editable.of(canSubmit),
                        LANGUAGES[selectedLanguage].codemirror,
                        EditorState.tabSize.of(6)
                    ]}
                    theme={oneDark}
                    style={{ height: '100%' }}
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
    );
};

export default CodeEditor;
