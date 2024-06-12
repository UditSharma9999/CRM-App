import axios from "axios";
import { useState } from "react";
import Button from '@mui/material/Button';
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, colors } from "@mui/material";
import { Card, Col, Container, Form } from "reactstrap";
import {useNavigate} from 'react-router-dom';


export default function CustomersFilter() {
 

  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }]);
  const [logic, setLogic] = useState('and');
  const [audienceSize, setAudienceSize] = useState(null);
  const navigate = useNavigate();

  const handleAddRule = () => {
    setRules([...rules, { field: '', operator: '', value: '' }]);
  };

  const handleRemoveRule = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleChangeRule = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const handleLogicChange = (e) => {
    setLogic(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:8080/audience/save'
    
      const response = await axios.post(url, { rules, logic });
      console.log(response);
      setAudienceSize(response.data.audienceSize);
      
      // if(response.data.audienceSize!=0 && response.data.audienceSize!=undefined) {
      //   navigate('/OldCampaign', {state:{'data': response.data.campaign}});;
      // }

    } catch (error) {
      console.error('Error fetching audience size:', error);
    }
  };

  const fields = [
    ['totalSpends', "Total Spends"],
    ['maxVisits', "Max Visits"],
    ['lastVisit', "Last Visit"]
  ]


  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '100vh', display: "flex", justifyContent: 'center', marginTop: '10rem' }}>
        <form onSubmit={handleSubmit}>
          {rules.map((rule, index) => (
            <div key={index}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="select-field-label">Select Field</InputLabel>
                <Select
                  value={rule.field}
                  onChange={(e) => handleChangeRule(index, 'field', e.target.value)}
                  labelId="select-field-label"
                  id="select-field"
                >
                  {fields.map((val) => (
                    <MenuItem key={val[0]} value={val[0]}>
                      {val[1]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width: 250 }}>
                <InputLabel id="select-operator-label">Select Operator</InputLabel>
                <Select
                  value={rule.operator}
                  onChange={(e) => handleChangeRule(index, 'operator', e.target.value)}
                  labelId="select-operator-label"
                  id="select-operator"
                >
                  <MenuItem value="$gt">{'<'}</MenuItem>
                  <MenuItem value="$lt">{'>'}</MenuItem>
                  <MenuItem value="$eq">{'='}</MenuItem>
                </Select>
              </FormControl>

              <OutlinedInput
                sx={{ height: '4em' }}
                value={rule.value}
                onChange={(e) => handleChangeRule(index, 'value', e.target.value)}
                placeholder="Enter Value"
                type="number"
              />

              <Button sx={{ height: '4rem', marginLeft: '1em' }} variant="outlined" type="button" onClick={() => handleRemoveRule(index)}>Remove</Button>
            </div>
          ))}

          <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', marginTop: '2rem', maxWidth: "inherit", flexDirection: 'row', justifyContent: 'center' }}>
              <Button type="button" variant="contained" onClick={handleAddRule} sx={{ marginRight: '1rem' }}>Add Rule</Button>
              <Select
                value={logic}
                onChange={handleLogicChange}
                sx={{ marginRight: '1rem' }}
              >
                <MenuItem value={'AND'}>AND</MenuItem>
                <MenuItem value={'OR'}>OR</MenuItem>
              </Select>
              <Button type="submit" variant="contained">Check Audience Size</Button>
            </Box>
          </Card>
          <Box maxWidth="inherit" sx={{ alignContent: 'center', textAlign: 'center' }}>
            {audienceSize !== null && (
              <div>
                <h3 style={{ color: 'red' }}>Audience Size: {audienceSize}</h3>
              </div>
            )}
          </Box>
        </form>
      </Box>
    </Container>
  );
}
