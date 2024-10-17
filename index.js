import express from 'express';
import parser from 'csv-parser'
import fs from 'fs';

const app = express();
const PORT = 7000;

const employeeData = [];

app.use(express.urlencoded({extended: true})); 

fs.createReadStream('data.csv')
  .pipe(parser())
  .on('data', (data) => employeeData.push(data))
  .on('end', () => {
  });

app.get('/' ,(req, res) => 
{
    const message =
    `<style>
        body
        {
            font-family: 'Roboto', sans-serif;
        }
   </style>
   <ul>
       <li><a href="/employees">/employees</a></li>
   </ul>
    `
    res.send(message);
});

app.get('/employees' ,async(req, res) => 
{
    try
    {
        res.json(employeeData);
    }
    catch
    {
        res.status(500).json({message: error.message});
    }
});
    
app.post('/employee' ,async(req, res) =>
{
    try
    {
        const employee = employeeData.create(req.body);
        res.status(200).json(employee);
    }
    catch
    {
        res.status(500).json({message: error.message});
    }
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost: ${PORT}`));

