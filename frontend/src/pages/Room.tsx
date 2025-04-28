import { FC, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Paper, Typography } from '@mui/material';
import submitCode from '../api/compiler/submitCode';
import { LANGUAGES } from '../api/compiler';

const Room: FC = () => {
    const [code, setCode] = useState<string>('# Escribe tu código aquí');
    const [output, setOutput] = useState<string>('');

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    const handleSubmitCode = () => {
        const language = LANGUAGES.python;
        submitCode(code, language)
            .then((data) => {
                console.log('Code submitted:', data);
                // TODO: Implement the logic to fetch the output
            })
            .catch((error) => {
                console.error('Error al ejecutar el código:', error);
                setOutput('Error al ejecutar el código');
            });
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', p: 2 }}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    mr: 1,
                }}
            >
                <Typography variant='h6' gutterBottom>
                    Editor de Código
                </Typography>
                <Box sx={{ flexGrow: 1, border: '1px solid grey', mb: 1 }}>
                    <Editor
                        height='100%'
                        defaultLanguage='python'
                        value={code}
                        onChange={handleEditorChange}
                        theme='vs-dark'
                    />
                </Box>
                <Button variant='contained' onClick={handleSubmitCode}>
                    Subir Código
                </Button>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 1,
                }}
            >
                <Typography variant='h6' gutterBottom>
                    Salida
                </Typography>
                <Paper
                    elevation={2}
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        backgroundColor: '#1e1e1e',
                        color: 'white',
                        overflowY: 'auto',
                    }}
                >
                    <pre>{output || 'La salida aparecerá aquí...'}</pre>
                </Paper>
            </Box>
        </Box>
    );
};

export default Room;
