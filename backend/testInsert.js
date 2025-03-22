const mongoose = require("mongoose");
const Invoice = require("./models/Invoice");

mongoose.connect("mongodb://localhost:27017/freelancers", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const invoices = [
    {
        invoiceNumber:1234567,
		fromCompany: "ABC Pvt Ltd",
        fromContact: "Mr. John Doe",
        fromEmail: "john@abc.com",
        fromPhone: "+91 9876543210",
        fromAddress: "123, Business Street, Mumbai, India",

        billTo: "XYZ Ltd",
        billToName: "Alice Brown",
        billToAddress: "456, Client Road, Bangalore, India",
        billToEmail: "alice@xyz.com",
        billToPhone: "+91 9876543211",

        items: [
            { description: "Web Development", value: 5000, qty: 1, taxRate: 18 },
            { description: "SEO Optimization", value: 3000, qty: 1, taxRate: 18 },
            { description: "Digital Marketing", value: 7000, qty: 2, taxRate: 18 },
            { description: "Cloud Hosting (1 Year)", value: 12000, qty: 1, taxRate: 12 },
            { description: "Technical Support (Monthly)", value: 2500, qty: 6, taxRate: 18 },
            { description: "UX/UI Design", value: 8000, qty: 1, taxRate: 18 }
        ]
    },
    {
        invoiceNumber:7654321,
		fromCompany: "DEF Solutions",
        fromContact: "Ms. Priya Sharma",
        fromEmail: "priya@def.com",
        fromPhone: "+91 9988776655",
        fromAddress: "789, Tech Park, Pune, India",

        billTo: "LMN Corp",
        billToName: "Michael Scott",
        billToAddress: "101, Business Tower, Delhi, India",
        billToEmail: "michael@lmn.com",
        billToPhone: "+91 9955664477",

        items: [
            { description: "Mobile App Development", value: 15000, qty: 1, taxRate: 18 },
            { description: "Database Migration", value: 5000, qty: 1, taxRate: 12 },
            { description: "Cybersecurity Audit", value: 8000, qty: 1, taxRate: 18 },
            { description: "Email Server Setup", value: 4000, qty: 1, taxRate: 12 },
            { description: "Performance Optimization", value: 6000, qty: 1, taxRate: 18 },
            { description: "E-commerce Integration", value: 10000, qty: 1, taxRate: 18 }
        ]
    }
];

Invoice.insertMany(invoices)
    .then(() => {
        console.log("Test invoices inserted successfully!");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("Error inserting invoices:", err);
    });
