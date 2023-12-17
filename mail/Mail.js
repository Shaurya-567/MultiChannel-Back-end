const nodemailer = require("nodemailer");
exports.sendMail =async(emailData)=>{
    const {to,subject,text,html} = emailData;
    try{
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            service: 'Gmail',
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: 'chauhansp07@gmail.com',
              pass: 'ayml klqh alde abeu ',
            }
          })
        let mailOptions = {
          from: '"MultiChannel-OWN 👻" <support@multichannelOwn.com>', // sender address
          to: to, // list of receivers
          subject: subject ,
          text: text,
          html: html, // html body
        }
      const mailResponse =await transporter.sendMail(mailOptions);
      if(!mailResponse){
        return {success: false,message:"Couldn't send mail"}
      }
      else{
        return {success: true,message:"Mail sent successfully"}
      }
      }
      catch(er){
        return {success: false, error:er,message:"Couldn't send mail"}
      }
}



