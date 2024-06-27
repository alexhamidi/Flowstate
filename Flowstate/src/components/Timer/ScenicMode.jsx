import React from 'react'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ThemeProvider, createTheme } from '@mui/material';


export default function ScenicMode(props) {
    const { handleScenicChange} = props;

    const theme = createTheme({
        typography: {
          fontFamily: [
            'Inter',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          fontSize: 13,
        },
    });



    return (
        <ThemeProvider theme={theme}>
            <FormControlLabel 
                control={<Switch
                    onChange={handleScenicChange}
                />} 
                label="Scenic Mode" 
            />
        </ThemeProvider>
    )
}
