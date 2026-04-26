const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(
"mongodb://sivasrinubandila207_db_user:12345@ac-xbpbfua-shard-00-00.lidnyc7.mongodb.net:27017,ac-xbpbfua-shard-00-01.lidnyc7.mongodb.net:27017,ac-xbpbfua-shard-00-02.lidnyc7.mongodb.net:27017/?ssl=true&replicaSet=atlas-12vi1i-shard-0&authSource=admin&appName=Cluster2026"
);

const conn = mongoose.connection;

conn.once("open", () => {
console.log("✅ Database connected");
});

conn.on("error", (err) => {
console.log("❌ Database error:", err.message);
});

app.get("/", (req,res)=>{
res.send("Backend Running");
});


// ROUTES
const contactRoutes = require("./routes/contactRoutes");
const educationRoutes = require("./routes/educationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/messages", contactRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/profile", profileRoutes);


// LOAD ALL DATA
const Project = require("./models/Project");
const Education = require("./models/education");
const Experience = require("./models/Experience");
const Certificate = require("./models/Certificate");
const Profile = require("./models/Profile");

app.get("/api/portfolio", async (req, res) => {
  try {
    const projects = await Project.find();
    const education = await Education.find();
    const experience = await Experience.find();
    const certificates = await Certificate.find();
    const profile = await Profile.findOne();

    res.json({
      projects: projects || [],
      education: education || [],
      experience: experience || [],
      certificates: certificates || [],
      profile: profile || {}
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8080;

app.listen(PORT, ()=>{
console.log(`🚀 Server running on port ${PORT}`);
});