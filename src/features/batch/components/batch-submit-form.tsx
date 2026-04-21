import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Icon,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';

import {
  DEFAULT_PRIVATE_KEY,
  TENANTS,
  Tenant,
  BatchSubmitResult,
  submitBatch,
} from '@/features/batch/api/submit-batch';

type Status = 'idle' | 'signing' | 'submitting' | 'success' | 'error';

export const BatchSubmitForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [tenant, setTenant] = useState<Tenant>('greenbank');
  const [govstack, setGovstack] = useState(false);
  const [registeringInstitution, setRegisteringInstitution] = useState('');
  const [program, setProgram] = useState('');
  const [privateKey, setPrivateKey] = useState(DEFAULT_PRIVATE_KEY);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<BatchSubmitResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCsvFile(file);
  };

  const handleSubmit = async () => {
    if (!csvFile) return;
    setResult(null);
    setErrorMessage('');

    try {
      setStatus('signing');
      const res = await submitBatch({
        csvFile,
        tenant,
        govstack,
        registeringInstitution: registeringInstitution || undefined,
        program: program || undefined,
        privateKey,
      });
      setStatus('success');
      setResult(res);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Batch submission failed');
    }
  };

  const reset = () => {
    setCsvFile(null);
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const busy = status === 'signing' || status === 'submitting';

  return (
    <Paper sx={{ p: 4, maxWidth: 640 }}>
      <Typography variant="h6" gutterBottom>
        Submit Batch Payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload a CSV file to submit a bulk payment batch to PaymentHub.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* CSV file picker */}
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            startIcon={<Icon baseClassName="material-symbols-outlined">upload_file</Icon>}
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
          >
            {csvFile ? 'Change CSV' : 'Select CSV File'}
          </Button>
          {csvFile && (
            <Chip
              label={csvFile.name}
              onDelete={reset}
              sx={{ ml: 1.5 }}
              icon={<Icon baseClassName="material-symbols-outlined" sx={{ fontSize: '18px !important' }}>description</Icon>}
            />
          )}
        </Box>

        {/* Tenant */}
        <FormControl size="small" sx={{ maxWidth: 200 }}>
          <InputLabel>Tenant</InputLabel>
          <Select
            value={tenant}
            label="Tenant"
            onChange={(e) => setTenant(e.target.value as Tenant)}
            disabled={busy}
          >
            {TENANTS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* GovStack mode */}
        <FormControlLabel
          control={
            <Switch
              checked={govstack}
              onChange={(e) => setGovstack(e.target.checked)}
              disabled={busy}
            />
          }
          label="GovStack mode (identity validation + de-bulking)"
        />

        {govstack && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 1 }}>
            <TextField
              label="Registering Institution ID"
              size="small"
              value={registeringInstitution}
              onChange={(e) => setRegisteringInstitution(e.target.value)}
              placeholder={`defaults to tenant (${tenant})`}
              disabled={busy}
              sx={{ maxWidth: 360 }}
            />
            <TextField
              label="Program ID (optional)"
              size="small"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              disabled={busy}
              sx={{ maxWidth: 360 }}
            />
          </Box>
        )}

        {/* Advanced: private key */}
        <Accordion disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <AccordionSummary expandIcon={<Icon baseClassName="material-symbols-outlined">expand_more</Icon>}>
            <Typography variant="body2">Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Private Key"
              multiline
              rows={4}
              fullWidth
              size="small"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              disabled={busy}
              slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: 11 } } }}
            />
          </AccordionDetails>
        </Accordion>

        {/* Submit */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!csvFile || busy}
            sx={{ backgroundColor: '#426834', '&:hover': { backgroundColor: '#55c9f7ff' } }}
          >
            {busy ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                {status === 'signing' ? 'Signing…' : 'Submitting…'}
              </>
            ) : (
              'Submit Batch'
            )}
          </Button>
          {(status === 'success' || status === 'error') && (
            <Button variant="text" onClick={reset}>
              Reset
            </Button>
          )}
        </Box>

        {/* Result */}
        {status === 'success' && result && (
          <Alert severity="success" icon={<Icon baseClassName="material-symbols-outlined">check_circle</Icon>}>
            <Typography variant="body2" fontWeight={700} gutterBottom>
              Batch submitted successfully
            </Typography>
            <Box component="pre" sx={{ fontSize: 12, m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(result, null, 2)}
            </Box>
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error">
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};
