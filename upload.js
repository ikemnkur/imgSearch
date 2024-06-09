const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      url: `/images/${req.file.filename}`,
      name: req.body.name,
      nickname: req.body.nickname,
      tags: req.body.tags.split(',').map(tag => tag.trim())
    });
  } else {
    res.status(400).json({ error: 'File not uploaded' });
  }
});

app.listen(5001, () => {
  console.log('Server started on http://localhost:5001');
});
