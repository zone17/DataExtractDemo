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

// Field styles restored
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

// Helper restored to render styled filled TextField
const renderStyledTextField = (label, value, formatter = formatNumber) => (
    <TextField
      label={label}
      value={formatter(value)}
      variant="filled" // Changed back to filled
      fullWidth
      margin="dense"
      InputProps={{
        readOnly: true,
        disableUnderline: true // Re-added explicit disable underline
      }}
      sx={fieldSx} // Re-added custom sx
      InputLabelProps={{ shrink: true }} // Re-added label shrink
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
    <Card sx={{ maxWidth: 700, margin: 'auto', mt: 4 , boxShadow: 3, backgroundColor: '#F9FAFB' }}>
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
        <Grid container spacing={2.5} sx={{ mb: 2 }}>
           <Grid item xs={12} sm={6}>
                {renderStyledTextField('First Name', name.firstname, formatNumber)}
           </Grid>
           <Grid item xs={12} sm={6}>
               {renderStyledTextField('Last Name', name.lastname, formatNumber)}
           </Grid>
        </Grid>

        {/* Main data grid */}
        <Grid container spacing={3}>
          {[ // Array of field configurations
            { label: 'Regular Hours', value: earnings.regular_hours, formatter: formatNumber },
            { label: 'Federal Income Tax', value: employeeTaxes.federal_income_tax, formatter: formatCurrency },
            { label: 'Social Security (Employer)', value: employerTaxes.social_security, formatter: formatCurrency },

            { label: 'Regular Earnings', value: earnings.regular_earnings, formatter: formatCurrency },
            { label: 'Social Security (Employee)', value: employeeTaxes.social_security, formatter: formatCurrency },
            { label: 'Medicare (Employer)', value: employerTaxes.medicare, formatter: formatCurrency },

            { label: 'Gross Pay', value: earnings.gross, formatter: formatCurrency },
            { label: 'Medicare (Employee)', value: employeeTaxes.medicare, formatter: formatCurrency },
            { label: 'CA ETT', value: employerTaxes['ca ett'], formatter: formatCurrency },

            // Empty placeholder for alignment if needed, or start next row
            { label: 'CA State Income Tax', value: employeeTaxes.ca_state_income_tax, formatter: formatCurrency },
            { label: 'CA SUI', value: employerTaxes.ca_sui, formatter: formatCurrency },

            // Empty placeholder
            { label: 'CA SDI', value: employeeTaxes.ca_sdi, formatter: formatCurrency },
            { label: 'FUTA', value: employerTaxes.futa, formatter: formatCurrency },

            // Empty placeholder
            { label: 'Total Employee Taxes', value: employeeTaxes.total, formatter: formatCurrency },
            { label: 'Total Employer Taxes', value: employerTaxes.total, formatter: formatCurrency },

            { label: 'Net Pay', value: totals.net_pay, formatter: formatCurrency },
            { label: 'Check Amount', value: totals.check_amount, formatter: formatCurrency },
            { label: 'Total Employer Cost', value: totals.employer_cost, formatter: formatCurrency },

          ].map((field, index) => (
            // Render an empty span or the actual field - Logic simplified
            <Grid item key={field.label || `field-${index}`} xs={12} sm={6} md={4}>
                {renderStyledTextField(field.label, field.value, field.formatter)}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollDisplay; 