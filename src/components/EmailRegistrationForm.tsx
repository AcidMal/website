import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
} from '@mui/material';
import { emailService } from '../pages/api/email';
import type { CreateEmailAccountDTO } from '../types/email';


export const EmailRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<CreateEmailAccountDTO>({
        local_part: '',
        password1: '',
        password2: '',
        domain: 'acidmal.com',
        active: 1,
        name: '',
        quota: 2048,
        force_pw_update: '0',
        tls_enforce_in: 1,
        tls_enforce_out: 1,
        tags: ''
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const response = await emailService.createEmailAccount(formData);
        
        if (response.success) {
            setSuccess(true);
            setFormData({
                local_part: '',
                password1: '',
                password2: '',
                domain: 'acidmal.com',
                active: 1,
                name: '',
                quota: 2048,
                force_pw_update: '0',
                tls_enforce_in: 1,
                tls_enforce_out: 1,
                tags: 'webregistered'
            });
        } else {
            setError(response.error || 'Failed to create email account');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Register New Email Account
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Username"
                    name="local_part"
                    value={formData.local_part}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

            
                <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                
                <TextField
                    fullWidth
                    label="Password"
                    name="password1"
                    type="password"
                    value={formData.password1}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    value={formData.password2}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Email account created successfully!
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Create Email Account
                </Button>
            </Box>
        </Paper>
    );
}; 