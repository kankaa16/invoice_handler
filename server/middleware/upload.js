import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //in uploads folder locally
  },

//saves the uploaded filename as currdate-oldname
  filename: (req, file, cb) => {
  const filename=Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

  cb(null, filename);
},
});

const fileFilter=(req, file, cb) => {
  if (
    //this is official mimetype for excel
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.originalname.endsWith(".xlsx")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx files allowed"));
  }
};

export default multer({
  storage,
  fileFilter,
});