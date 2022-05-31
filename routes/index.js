const express = require('express');

const fs = require('fs');

const path = require('path');

const xlsx = require('xlsx');

const routes = express.Router();

async function writeToExcel(arraydata){
    const wb = xlsx.utils.book_new();
    const finaldata = [];
    arraydata.forEach(row=>{ 
        finaldata.push(row.split('|'));
    })            
    const ws = xlsx.utils.aoa_to_sheet(finaldata);
    xlsx.utils.book_append_sheet(wb, ws, 'users_sheet');
    const filename = "users.xlsx";
    const wbOpts = {bookType: 'xlsx', type: 'binary'};
    xlsx.writeFile(wb, filename, wbOpts) ;    
    return console.log("success");           
}
  
routes.get('/convert', async(req, res) => {    
    try{       
    console.log(path.join(__dirname, '..', 'example.dat'));
    fs.readFile(path.join(__dirname, '..', 'example.dat'), {encoding:'utf-8'}, async(err, data)=>{        
        let arraydata = [];
        if(err)
            throw err;
        arraydata = data.split(/\r?\n/);           
        if(arraydata){        
            await writeToExcel(arraydata);
        }                        
    })
    res.status(200).send(`Successfully converted`);   
    }
    catch(err){
        console.error(`Error occurred ${err}`);
        res.status(504).send(`${err}`);
    }        
})

module.exports = routes
