import React, {useState, useEffect} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {Typography, Button, InputLabel, Select, MenuItem, Grid} from '@material-ui/core';
import FormInput from './CustomTextField';
import {commerce} from '../../lib/commerce';
import {Link} from 'react-router-dom';

function AddressForm({checkoutToken, next}) {
    const methods = useForm();

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState('');
    const [options, setOptions] = useState([]);
    const [option, setOption] = useState('');

    const fetchCountries = async (checkoutTokenId) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId)
        setCountries(countries)
        setCountry(Object.keys(countries)[0])
    }
    const countryNames = Object.entries(countries).map(([code, name])=> ({ id: code, label: name}))

    const fetchSubdivisions = async (countryCode) => {
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode)
        setRegions(subdivisions)
        setRegion(Object.keys(subdivisions)[0])
    }
    const regionNames = Object.entries(regions).map(([code, name])=> ({id: code, label: name}))

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, place: stateProvince });
        setOptions(options);
        setOption(Object.keys(options)[0]);
    };

    useEffect(() => {
        fetchCountries(checkoutToken.id)
    }, [])
    useEffect(() => {
        if(country) fetchSubdivisions(country)
    }, [country])
    useEffect(() => {
        if (region) fetchShippingOptions(checkoutToken.id, country, region);
      }, [region]);
    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=>next({...data, country, region, option}))}>
                    <Grid container spacing={3}>
                        <FormInput required name='firstname' label='First Name'/>
                        <FormInput required name='lastname' label='Last Name'/>
                        <FormInput required name='address1' label='Address'/>
                        <FormInput required name='email' label='Email'/>
                        <FormInput required name='city' label='City'/>
                        <FormInput required name='zip' label='ZIP / Postal Code'/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel> Shipping Country</InputLabel>
                            <Select fullWidth onChange={(e)=> setCountry(e.target.value)} value={country}>
                                {countryNames.map((item)=> (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                </MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel> Shipping Regions</InputLabel>
                            <Select fullWidth onChange={(e)=> setRegion(e.target.value)} value={region}>
                                {regionNames.map((item)=> (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid> 
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={option} fullWidth onChange={(e) => setOption(e.target.value)}>
                                {options.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                                ))}
                            </Select>
                        </Grid>   
                    </Grid>
                    <br/>
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Link to='/cart'>
                            <Button variant="outlined">Back to Cart</Button>
                        </Link>
                        <Button type="submit" variant="contained" color="primary">Proceed To Payment</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
