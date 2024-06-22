const uuid = require("uuid")
const multer = require("multer");
// UID Generation
function generateID() {
    return uuid.v4();
  }
// Image Storage Engine

// Định nghĩa việc upload
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// upload với các storage đã được định nghĩa ở trên
const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))


app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

app.post('/addproduct',async (req,res)=>{

  const product = new Product({
      id: generateID(),
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Save");
  res.json({
      success:true,
      name:req.body.name,

  })
})

// Create API For deleting Products

app.post('/removeproduct',async (req,res)=>{
await Product.findOneAndDelete({id:req.body.id});
console.log("Removed");
res.json({
  success:true,
  name:req.body.name,
  id: product.id,
})
})