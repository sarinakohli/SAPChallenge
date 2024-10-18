import express from 'express';
import parser from 'csv-parser'
import fs from 'fs';
import stripBomStream from 'strip-bom-stream';

const app = express();
const PORT = 7000;

const employeeData = [];

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

fs.createReadStream('data.csv')
  .pipe(stripBomStream())
  .pipe(parser())
  .on('data', (data) => employeeData.push(data))
  .on('end', () => 
    {
        console.log('CSV file successfully processed');
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
   <p>Welcome to my CRUD API</p>
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

app.get('/employee/:id', async(req, res) => 
{
    try 
    {
        const employeeId = req.params.id.trim();  
    
        const employee = await employeeData.find(e => e.id.trim() === employeeId);
    
        if (!employee) 
        {
          return res.status(404).send('Employee not found');
        }
        res.json(employee);
    } 
    catch (error)
    {
        res.status(500).send('An error occurred while fetching the employee data');
    }
});
    
app.post('/employees' ,async(req, res) =>
{
    try
    {
        const employee = 
        {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            position: req.body.position,
            salary: req.body.salary
        };
        employeeData.push(employee);
        res.json("Employee added successfully");
    }
    catch (error)
    {
        res.status(500).send('An error occurred while adding the employee data');
    }
        
});

app.put('/employee/:id' ,async(req,res) =>
{
    try 
    {
        const employeeId = req.params.id.trim();
    
        const employee = await employeeData.find(e => e.id.trim() === employeeId);
        if (!employee) 
        {
            return res.status(404).send("Employee not found");
        }
        employee.name = req.body.name;
        employee.email = req.body.email;
        employee.position = req.body.position;
        employee.salary = req.body.salary;
        res.json("Employee Updated successfully");
    } 
    catch (error)
    {
        res.status(500).send('An error occurred while updating the employee data');
    }
});

app.delete('/employee/:id' ,async(req,res) =>
{
    try
    {
        const employeeId = req.params.id.trim();
    
        const employee = await employeeData.find(e => e.id.trim() === employeeId);

        if (!employee)
        {
            return res.status(404).send("Employee not found");
        }
        const index = employeeData.indexOf(employee);
        employeeData.splice(index, 1);
        res.send("Employee deleted successfully");
    }
    catch (error)
    {
        res.status(500).send('An error occurred while deleting the employee data');
    }
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost: ${PORT}`));

