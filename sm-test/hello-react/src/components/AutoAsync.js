import axios from "axios"
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { propTypes } from "react-bootstrap/esm/Image";
import Button from '@material-ui/core/Button';
import '../Global'
import '../design/AutoAsync.scss'
const Asynchronous = ({onSelected, defaultCompanyName}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const loading = open && options.length === 0;
  const preset = defaultCompanyName!=="선택중";
  const [changed, setChanged] = React.useState(false||defaultCompanyName==="선택중");


  React.useEffect(() => {
    (async () => {
      const response = await axios.get(global.url+'companylist',{withCredentials:true});
      const companys = await response.data.companys
      companys.map((company) =>{
        if(preset && !changed && company.companyName===defaultCompanyName){
          onSelected(company);
        }
      })
    })();

  }, []);


  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
        const response = await axios.get(global.url+'companylist');
        const companys = await response.data.companys
      if (active) {
        setOptions(companys);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);



let result=<br/>;


if(preset&& !changed){
  result = 
  <div>
  <Button variant="contained" onClick={()=>{
    setChanged(true)
  }}>{defaultCompanyName}</Button>
  </div>
  }
  else{
    result =  
    <Autocomplete
    
    open={open}
    onChange={(e, t) =>{
      onSelected(t);
    }}
    onOpen={() => {
      setOpen(true);
    }}
    onClose={() => {
      setOpen(false);
    }}
    getOptionSelected={(option, value) => option.companyName === value.companyName}
    getOptionLabel={(option) => option.companyName}
    options={options}
    loading={loading}
    renderInput={(params) => (
      <TextField
        {...params}
        label={"company"}
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    )}
  />;
  }
  return (
    result
  );
}

Asynchronous.prototypes={
  onSelected : propTypes.func

}

export default Asynchronous
            
   