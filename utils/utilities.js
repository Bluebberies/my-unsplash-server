const multer = require('multer')
const winston = require('winston')
const fs = require('fs')
const mime = require('mime-types')
const cloudinary = require('cloudinary').v2
const { v4 } = require('uuid')

const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
      winston.info(file)
      const uniqueFileName = `${Date.now()}.${mime.extension(file.mimetype)}`
      cb(null, uniqueFileName)
    }
  })

  const upload = multer({ storage: storage })

  return upload.single('avatar')
}

const checkAndDelete = () => {
  const file = fs.readdirSync('images')
  if (file.length > 1) {
    fs.unlinkSync(`./images/${file[0]}`)
  }
}

const uploadToCloudinary = async (req, res) => {
  try {
    const file = fs.readdirSync('images')
    const lastFile = file[file.length - 1]
    const imagePath = req.file ? `./images/${lastFile}` : req.body.url
    const result = await cloudinary.uploader.upload(imagePath)
    res.send({
      id: v4(),
      label: req.file ? req.file.originalname : req.body.label,
      url: result.secure_url
    })
  } catch (ex) {
    winston.error(ex)
  }
}

module.exports = { uploadImage, checkAndDelete, uploadToCloudinary }
