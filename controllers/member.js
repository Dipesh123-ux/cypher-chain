const Member = require("../models/member");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    console.log(files);
    if (err) {
      return res.status(400).json({
        err: "Image could not be uploaded",
      });
    }

    const { name, description, role } = fields;

    let member = new Member();
    member.name = name;
    member.description = description;
    member.role = role;

    if (files.photo) {
      member.photo.data = fs.readFileSync(files.photo.filepath);
      member.photo.contentType = files.photo.mimetype;
    }

    member.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        return res.status(200).json({
          result: result,
          message: "success",
        });
      }
    });
  });
};

exports.list = (req, res) => {
  Member.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      members: data,
    });
  });
};

exports.photo = (req, res) => {
  const id = req.params.id;
  Member.find({_id:id})
    .select("photo")
    .exec((err, pic) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      if (pic) {
        res.set("Content-Type", pic[0].photo.contentType);
        return res.send(pic[0].photo.data);
      }
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Member.findOne({ _id:id }).exec((err, oldMem) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      oldMem = _.merge(oldMem, fields);

      if (files.photo) {
        oldMem.photo.data = fs.readFileSync(files.photo.filepath);
        oldMem.photo.contentType = files.photo.mimetype;
      }

      oldMem.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json(result);
      });
    });
  });
};


exports.remove = (req, res)=>{
  const id = req.params.id;
  Member.findOneAndRemove({_id:id}).exec((err,data)=>{
    if(err){
      return res.status(404).json({
        error: err,
      })
    }
    res.status(200).json({
      message: "member deleted successfully"
    })
  })
}