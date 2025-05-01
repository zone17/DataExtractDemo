import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
} from '@mui/material';

// Helper function to format currency - return string
const formatCurrency = (value) => {
    let numValue = value;
    if (typeof value === 'string') {
      numValue = parseFloat(value);
      if (isNaN(numValue)) return value; // Return original string if not parsable
    }

    if (typeof numValue === 'number') {
         // Basic check: if it has decimals or is relatively small, assume it's dollars
         // if it's a large integer, assume cents. Refine this as needed.
        if (numValue % 1 !== 0 || Math.abs(numValue) < 10000) { // Adjusted threshold heuristic
            return numValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
        } else {
             return (numValue / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
              });
        }
    }
    return value; // Fallback for non-numeric types
  };

// Helper function to format regular numbers or hours - return string
const formatNumber = (value) => {
      let numValue = value;
      if (typeof value === 'string') {
        numValue = parseFloat(value);
        if (isNaN(numValue)) return value; // Return original string if not parsable
      }

    if (typeof numValue === 'number') {
      return numValue.toLocaleString('en-US');
    }
    return value; // Fallback
  };

// Field styles to match the image
const fieldSx = {
    "& .MuiFilledInput-root": {
        backgroundColor: '#FEF9C3', // Light yellow background
        "&:hover": {
          backgroundColor: '#FEF3C7', // Slightly darker yellow on hover (optional)
        },
        "&.Mui-focused": {
          backgroundColor: '#FEF9C3', // Keep yellow when focused
        },
        // Remove the underline
        "&:before, &:after": {
          borderBottom: "none",
        },
         "&:hover:not(.Mui-disabled):before": {
          borderBottom: 'none' // Remove underline on hover
         }
      },
       // Ensure label is positioned correctly
      "& .MuiInputLabel-root": {
          // Adjust if needed, but filled variant usually handles this
      },
      "& .MuiFilledInput-input": {
          // Optional: Adjust padding if necessary
      }
};

// Helper to render a read-only TextField styled like the image
const renderStyledTextField = (label, value, formatter = formatNumber) => (
    <TextField
      label={label}
      value={formatter(value)}
      variant="filled"
      fullWidth
      margin="dense"
      InputProps={{
        readOnly: true,
        disableUnderline: true // Explicitly disable underline
      }}
      sx={fieldSx} // Apply the custom styles
      InputLabelProps={{ shrink: true }} // Ensure label stays shrunk
    />
  );

const PayrollDisplay = ({ data }) => {
  // Assuming data is an array, we'll display the first record for now
  // You might want to map over the array if there are multiple records
  const record = data && data.length > 0 ? data[0] : null;

  if (!record) {
    return <Typography>No payroll data available.</Typography>;
  }

  // Extract nested objects, handling potential missing keys gracefully
  // Use optional chaining (?.) for safer access
  const name = record.name || { firstname: record.firstname || 'N/A', lastname: record.lastname || 'N/A' }; // Handle top-level name fields too
  const earnings = record.earnings || {};
  const employeeTaxes = record.employee_taxes || {};
  const employerTaxes = record.employer_taxes || {};
  const totals = record.totals || {};

  return (
    <Card sx={{ maxWidth: 700, margin: 'auto', mt: 4, boxShadow: 3, backgroundColor: '#F9FAFB' /* Match Card background if needed */ }}>
      <CardContent sx={{ p: 3 /* Add padding like the image */ }}>
        {/* Mimic title style from image */}
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Data Extract
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
           this is a summary of the data extracted from the file uploaded
        </Typography>

        {/* Employee Name - maybe display differently? */}
        {/* <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Employee: {name.firstname} {name.lastname}
        </Typography> */}

        {/* Grid for Name Fields */}
        <Grid container spacing={2.5} sx={{ mb: 2 }}> {/* Add bottom margin before next grid */}
           <Grid item xs={12} sm={6}>
                {renderStyledTextField('First Name', name.firstname, formatNumber)} {/* formatNumber is fine for names */}
           </Grid>
           <Grid item xs={12} sm={6}>
               {renderStyledTextField('Last Name', name.lastname, formatNumber)}
           </Grid>
        </Grid>

        <Grid container spacing={2.5}> {/* Adjust spacing to match image */}
          {/* Earnings Section */}
          <Grid item xs={12} sm={6}>
            {/* <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}> Earnings </Typography> */}
            <Box>
              {renderStyledTextField('Regular Hours', earnings.regular_hours)}
              {renderStyledTextField('Regular Earnings', earnings.regular_earnings, formatCurrency)}
              {renderStyledTextField('Gross Pay', earnings.gross, formatCurrency)}
            </Box>
          </Grid>

          {/* Employee Taxes Section */}
          <Grid item xs={12} sm={6}>
            {/* <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}> Employee Taxes </Typography> */}
             <Box>
              {renderStyledTextField('Federal Income Tax', employeeTaxes.federal_income_tax, formatCurrency)}
              {renderStyledTextField('Social Security (Employee)', employeeTaxes.social_security, formatCurrency)}
              {renderStyledTextField('Medicare (Employee)', employeeTaxes.medicare, formatCurrency)}
              {renderStyledTextField('CA State Income Tax', employeeTaxes.ca_state_income_tax, formatCurrency)}
              {renderStyledTextField('CA SDI', employeeTaxes.ca_sdi, formatCurrency)}
              {renderStyledTextField('Total Employee Taxes', employeeTaxes.total, formatCurrency)}
             </Box>
          </Grid>

          {/* Employer Taxes Section */}
           <Grid item xs={12} sm={6}>
            {/* <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}> Employer Taxes </Typography> */}
             <Box>
               {renderStyledTextField('Social Security (Employer)', employerTaxes.social_security, formatCurrency)}
               {renderStyledTextField('Medicare (Employer)', employerTaxes.medicare, formatCurrency)}
               {renderStyledTextField('CA ETT', employerTaxes['ca ett'], formatCurrency)}
               {renderStyledTextField('CA SUI', employerTaxes.ca_sui, formatCurrency)}
               {renderStyledTextField('FUTA', employerTaxes.futa, formatCurrency)}
               {renderStyledTextField('Total Employer Taxes', employerTaxes.total, formatCurrency)}
            </Box>
          </Grid>

          {/* Totals Section */}
          <Grid item xs={12} sm={6}>
            {/* <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}> Totals </Typography> */}
             <Box>
              {renderStyledTextField('Net Pay', totals.net_pay, formatCurrency)}
              {renderStyledTextField('Check Amount', totals.check_amount, formatCurrency)}
              {renderStyledTextField('Total Employer Cost', totals.employer_cost, formatCurrency)}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollDisplay; 