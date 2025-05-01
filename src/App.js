import React from 'react';
import PayrollDisplay from './components/PayrollDisplay'; // Updated path
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// The JSON data from your example
const payrollData = [
    {
        "lastname": "Shi", "firstname": "Jian", "name": {"lastname": "Shi", "firstname": "Jian"},
        "earnings": {"regular_hours": 116, "regular_earnings": 40600, "gross": 40600},
        "employee_taxes": {"federal_income_tax": 7195.72, "social_security": 2517.2, "medicare": 588.7, "ca_state_income_tax": 2699.98, "ca_sdi": 487.2, "total": 13488.8},
        "employer_taxes": {"social_security": 2517.2, "medicare": 588.7, "ca ett": 7, "ca_sui": 238, "futa": 42, "total": 3392.9},
        "totals": {"net_pay": 27111.2, "check_amount": 27111.2, "employer_cost": 43992.9}
    }
    // Add more employee records here if needed
];

function App() {
  return (
    <React.Fragment>
      <CssBaseline /> {/* MUI CSS reset/baseline */}
      <Container maxWidth="md"> {/* Optional: centers content */} 
        <PayrollDisplay data={payrollData} />
      </Container>
    </React.Fragment>
  );
}

export default App; 