const express= require("express");
const register = require("./register_collection");
const login = require("./login_collection");
const cors =require("cors");
const bcrypt = require("bcrypt"); 
const app = express();
const jwt = require('jsonwebtoken');
const employee = require("./employee_register");
const RehabilitationCenter = require("./RehabilitationCenter");
const Government = require("./GovernmentInfo")
const Doctor = require("./newdoctor")
const DoctorInfo = require("./DoctorInfo");
const Admin= require("./center_admin")
const Newsletter = require("./newsletter");
const Appointment = require("./appointment")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
    // Define your root route logic here
    res.json("Welcome to the backend server ");
  });



  app.get('/alldoctors', async (req, res) => {
    try {
      // Fetch all admin records from the 'RehabilitationCenter' collection
      const adminsData = await Doctor.find({});
  
      // Send the retrieved admin data as a response
      res.json({ admins: adminsData });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Failed to retrieve admin data' });
    }
  });
  
  
  
  app.post("/doctorr", async (req, res) => {
    const {
      name,
          number,
          email,
          password,
          doctor_id,
          dob,
          experience,
          phone
  
  
    } = req.body;
  
    const data = {
      name:name,
          number:number,
          email:email,
          phone:phone,
         
          doctor_id:doctor_id,
          dob:dob,
          experience:experience
  
    };
  
    const data2 = {
      email: email,
      password:password,
      logintype:"doctor"
    };
  
    try {
      const check = await login.findOne({ email: email });
      if (check) {
        res.json("exists");
      } else {
        await Doctor.insertMany([data]);
        await login.insertMany([data2]);
        res.json("notexists");
      }
    } catch (e) {
      res.json(e);
    }
  });
  app.post("/Register", async (req, res) => {
    const {
      Firstname,
      Secondname,
      Age,
      Aadhar,
      Number,
      Address,
      City,
      Pincode,
      Gender,
      Substance,
      email,
      password,
      date,
      center,
    } = req.body;
  
    const data = {
      Age: Age,
      Aadhar: Aadhar,
      Number: Number,
      Address: Address,
      City: City,
      Pincode: Pincode,
      Gender: Gender,
      Substance: Substance,
      email: email,
      Firstname: Firstname,
      Secondname: Secondname,
      date: new Date(),
      center:center
    };
  
    const data2 = {
      email: email,
      password: await bcrypt.hash(password, 10), // Hash the password before storing
      logintype: "user"
    };
  
    try {
      const check = await login.findOne({ email: email });
      if (check) {
        res.json("exists");
      } else {
        await register.insertMany([data]);
        await login.insertMany([data2]);
        res.json("notexists");
      }
    } catch (e) {
      res.json("servererror");
    }
  });
  



//employee register
app.post("/employee_Register",async(req,res)=>{
  const{   name,
            email,
            employee_Id,
            center_name,
            number,
            password,

      date} =req.body;

      const data = {
        name:name,
        email:email,
        employee_Id:employee_Id,
        center_name:center_name,
        number:number,
          Date: new Date()
        };
        const data2 = {
          email:email,
          password:password,
          logintype:"employee"
        }

      try{
          const check = await employee.findOne({employee_Id:employee_Id})
          if (check){
              res.json("exists")
              }
              
          else{
              await employee.insertMany([data])
              await login.insertMany([data2])
              res.json("notexists")

          }
      }
          catch (e){
              res.json("servererror")
          }
      
})  

// admin register connected

app.post("/admin_Register",async(req,res)=>{
  const{   name,
            email,
            admin_id,
            center_name,
            number,
            password,

      date} =req.body;

      const data = {
        name:name,
        email:email,
        admin_id:admin_id,
        center_name:center_name,
        number:number,
          Date: new Date()
        };
        const data2 = {
          email:email,
          password:password,
          logintype:"Admin"
        }

      try{
          const check = await Admin.findOne({admin_id:admin_id})
          if (check){
              res.json("exists")
              }
              
          else{
              await Admin.insertMany([data])
              await login.insertMany([data2])
              res.json("notexists")

          }
      }
          catch (e){
              res.json("servererror")
          }
      
})  



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login.findOne({ email });

    if (user) {
      // Compare the entered password with the hashed password using bcrypt.compare
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.json("exists");
      } else {
        res.json("invalidpassword");
      }
    } else {
      res.json("notexists");
    }
  } catch (e) {
    res.json("servererror");
  }
});

app.post("/Appointment", async (req, res) => {
  const {
    phone,
    address,
    date,
    doctor,
  } = req.body;

  const data = {
    phone: phone,
    address: address,
    date: date,
    doctor: doctor
  };

  try {
    const check = await Appointment.findOne({ phone: phone });
    if (check) {
      res.json("exists");
    } else {
      await Appointment.insertMany([data]);
      res.json("notexists");
    }
  } catch (e) {
    res.json(e);
  }
});


  app.post("/signup", async (req, res) => {

    
    const { sname, semail, spassword ,date} = req.body;
  
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegex.test(semail)) {
      return res.json("invalidemail");
    }
  
    if (!/^[a-zA-Z0-9\s]*$/.test(sname) || sname.trim().length === 0) {
      return res.json("invalidname");
    }
    
    
    if (spassword.length < 5) {
      return res.json("invalidpassword");
    }
    
  
    const data = {
      name: sname,
      email: semail,
      password: spassword,
      logintype:logintype,
      date: new Date(),
      

    };
     
    try {
      let token
      const check = await login.findOne({ email: semail });
       
      if (check) {
        return res.json("exists");
      } else {
        const newUser = new login(data);
        const token = await newUser.generateAuthToken(); // Correct token generation
        console.log(token); // Log the generated token

  
        await newUser.save(); // Save the new user
        res.cookie("jwttoken",token,{
          expires:new Date(Date.now()+25892000000),
          httpOnly:true,
          secure:true, sameSite:'None'
          
         

        } )
        console.log( " token saved Sucessfull")

        return res.json( "notexists"); // Respond with token and message
      }
        
   
      
    } catch (e) {
      res.json("server error");
      
    }
  });

  
// Endpoint to retrieve all patient data
app.get('/patientdata', async (req, res) => {
  try {
    // Fetch all patient records from the 'register' collection
    const patients = await register.find({});

    // Send the retrieved patient data as a response
    res.json({ patients });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Failed to retrieve patient data' });
  }
});

// graph data

app.get('/graphdata', async (req, res) => {
  try {
    const totalregisters = await register.countDocuments();
    const totaldoctors = await Doctor.countDocuments();
    const totalcenters = await Admin.countDocuments();

    const responseData = {
      totalregisters: totalregisters,
      totaldoctors: totaldoctors,
      totalcenters: totalcenters
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/admindata', async (req, res) => {
  try {
    // Fetch all admin records from the 'RehabilitationCenter' collection
    const adminsData = await Admin.find({});

    // Send the retrieved admin data as a response
    res.json({ admins: adminsData });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Failed to retrieve admin data' });
  }
});

app.get("/substanceCounts", async (req, res) => {
  try {
    // Use aggregation pipeline to count documents for each substance
    const substanceCounts = await register.aggregate([
      {
        $group: {
          _id: '$Substance',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform the result into an object for easier access
    const countsObject = substanceCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Send the counts as a response
    res.json(countsObject);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Failed to get substance counts' });
  }
});

app.get('/alldoctors', async (req, res) => {
  try {
    // Fetch all admin records from the 'RehabilitationCenter' collection
    const adminsData = await DoctorInfo.find({});

    // Send the retrieved admin data as a response
    res.json({ admins: adminsData });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Failed to retrieve admin data' });
  }
});

app.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email already exists in the newsletter
    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists in the newsletter' });
    }

    // Create a new Newsletter instance
    const newSubscriber = new Newsletter({ email });

    // Save the new subscriber to the database
    await newSubscriber.save();

    res.json({ message: 'Email added to the newsletter successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add email to the newsletter' });
  }
});

app.get('/center/:id', async (req, res) => {
  const centerId = req.params.id;

  try {
    // Fetch center details based on the provided ID
    const centerData = await Admin.findOne({ _id: centerId });

    // Check if the center exists
    if (centerData) {
      // Send the retrieved center data as a response
      res.json({ center: centerData });
    } else {
      // If the center doesn't exist, return an error response
      res.status(404).json({ error: 'Center not found' });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching center data:', error);
    res.status(500).json({ error: 'Failed to retrieve center data' });
  }
});

app.post('/center', async (req, res) => {
  const { id } = req.body;

  try {
    const centerData = await Admin.findOne({ _id: id });

    if (centerData) {
      res.json({ center: centerData });
    } else {
      res.status(404).json({ error: 'Center not found' });
    }
  } catch (error) {
    console.error('Error fetching center data:', error);
    res.status(500).json({ error: 'Failed to retrieve center data' });
  }
});

app.post('/patientsByCenter', async (req, res) => {
  const { center } = req.body; // Retrieve the 'center' value from the request body

  try {
    // Fetch patients based on the provided center value
    const patients = await register.find({ center: center });

    // Send the retrieved patient data as a response
    res.json({ patients });
  } catch (error) {
    // Handle errors
    console.error('Failed to retrieve patients by center:', error);
    res.status(500).json({ error: 'Failed to retrieve patients by center' });
  }
});




app.listen(8000,()=>{
    console.log("Server listening at port 8000")
})
  
